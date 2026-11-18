from math import fsum

from app.core.database import utcnow
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import EstadoPedido, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.schemas import UserPublic


class PedidoNoEncontrado(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ReglaPedido(Exception):
    pass


class ProductoRepetido(ReglaPedido):
    pass


class ProductoNoDisponible(ReglaPedido):
    pass


class StockInsuficiente(ReglaPedido):
    pass


class TransicionInvalida(ReglaPedido):
    pass


TRANSICIONES: dict[str, set[EstadoPedido]] = {
    "PENDIENTE": {"EN_PREPARACION", "CANCELADO"},
    "EN_PREPARACION": {"ENTREGADO", "CANCELADO"},
    "ENTREGADO": set(),
    "CANCELADO": set(),
}


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork) -> None:
        self.uow = uow

    def crear(self, data: PedidoCreate, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            ids = {item.producto_id for item in data.items}
            if len(ids) != len(data.items):
                raise ProductoRepetido("Un producto no puede repetirse en el pedido")
            pedido = uow.pedidos.add(Pedido(
                usuario_id=usuario_id, forma_pago=data.forma_pago,
                direccion_entrega=data.direccion_entrega, notas=data.notas, total=0,
            ))
            # Siempre se bloquean los productos en el mismo orden para evitar esperas circulares.
            for item in sorted(data.items, key=lambda item: item.producto_id):
                producto = uow.productos.get_by_id(item.producto_id, bloquear=True)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} no encontrado")
                if not producto.disponible:
                    raise ProductoNoDisponible(f"{producto.nombre} no está disponible")
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f"Stock insuficiente para {producto.nombre}")
                producto.stock -= item.cantidad
                pedido.items.append(DetallePedido(
                    producto_id=item.producto_id, cantidad=item.cantidad,
                    nombre_producto=producto.nombre, precio_unitario=producto.precio_base,
                    subtotal=producto.precio_base * item.cantidad,
                ))
            pedido.total = fsum(item.subtotal for item in pedido.items)
            return PedidoRead.model_validate(pedido)

    def listar(self, usuario: UserPublic, skip: int, limit: int, estado: EstadoPedido | None) -> PedidosPaginados:
        with self.uow as uow:
            propietario = None if usuario.role == "admin" else usuario.id
            total, pedidos = uow.pedidos.list_by_usuario(propietario, skip, limit, estado)
            return PedidosPaginados(total=total, items=[PedidoRead.model_validate(row) for row in pedidos])

    def detalle(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar(uow, pedido_id)
            if usuario.role != "admin" and pedido.usuario_id != usuario.id:
                raise PedidoAjeno("El pedido pertenece a otro usuario")
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, estado: EstadoPedido) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar(uow, pedido_id, bloquear=True)
            self._transicion(uow, pedido, estado)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario_id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = self._buscar(uow, pedido_id, bloquear=True)
            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno("El pedido pertenece a otro usuario")
            if pedido.estado != "PENDIENTE":
                raise TransicionInvalida("Solo se puede cancelar un pedido pendiente")
            self._transicion(uow, pedido, "CANCELADO")
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            conteos = uow.pedidos.count_by_estado()
            inicio = utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            return ResumenPedidos(
                pendientes=conteos.get("PENDIENTE", 0), en_preparacion=conteos.get("EN_PREPARACION", 0),
                entregados=conteos.get("ENTREGADO", 0), cancelados=conteos.get("CANCELADO", 0),
                pedidos_hoy=uow.pedidos.count_by_dia(inicio),
                ingresos_entregados=uow.pedidos.suma_por_estado("ENTREGADO"),
            )

    @staticmethod
    def _buscar(uow: PedidoUnitOfWork, pedido_id: int, *, bloquear: bool = False) -> Pedido:
        pedido = uow.pedidos.get_by_id(pedido_id, bloquear=bloquear)
        if pedido is None:
            raise PedidoNoEncontrado("Pedido no encontrado")
        return pedido

    @staticmethod
    def _transicion(uow: PedidoUnitOfWork, pedido: Pedido, estado: EstadoPedido) -> None:
        if estado not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(f"No se puede pasar de {pedido.estado} a {estado}")
        if estado == "CANCELADO":
            for item in sorted(pedido.items, key=lambda item: item.producto_id):
                producto = uow.productos.get_by_id(item.producto_id, bloquear=True)
                if producto is None:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} no encontrado")
                producto.stock += item.cantidad
        pedido.estado = estado
        pedido.updated_at = utcnow()
