from app.modules.productos.models import Producto
from app.modules.productos.schemas import ProductoCreate, ProductoRead, ProductoStockUpdate, ProductoUpdate, ProductosPaginados
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork) -> None:
        self.uow = uow

    def listar(self, skip: int, limit: int, search: str | None, categoria_id: int | None, disponible: bool | None) -> ProductosPaginados:
        with self.uow as uow:
            total, productos = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(total=total, items=[ProductoRead.model_validate(row) for row in productos])

    def detalle(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            return ProductoRead.model_validate(self._activo(uow, producto_id))

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._validar_categoria(uow, data.categoria_id)
            producto = uow.productos.add(Producto.model_validate(data))
            return ProductoRead.model_validate(producto)

    def actualizar(self, producto_id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._activo(uow, producto_id, bloquear=True)
            if data.categoria_id is not None and data.categoria_id != producto.categoria_id:
                self._validar_categoria(uow, data.categoria_id)
            producto.sqlmodel_update(data.model_dump(exclude_unset=True))
            return ProductoRead.model_validate(producto)

    def cambiar_stock(self, producto_id: int, data: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._activo(uow, producto_id, bloquear=True)
            producto.sqlmodel_update(data.model_dump())
            return ProductoRead.model_validate(producto)

    def anular(self, producto_id: int) -> None:
        with self.uow as uow:
            self._activo(uow, producto_id, bloquear=True).activo = False

    @staticmethod
    def _activo(uow: ProductoUnitOfWork, producto_id: int, *, bloquear: bool = False) -> Producto:
        producto = uow.productos.get_by_id(producto_id, bloquear=bloquear)
        if producto is None or not producto.activo:
            raise ProductoNoEncontrado("Producto no encontrado")
        return producto

    @staticmethod
    def _validar_categoria(uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id, bloquear=True)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada("Categoría no encontrada")
