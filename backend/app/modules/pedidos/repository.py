from datetime import datetime, timedelta

from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido
from app.modules.pedidos.schemas import EstadoPedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def get_by_id(self, entity_id: int, *, bloquear: bool = False) -> Pedido | None:
        query = select(Pedido).where(Pedido.id == entity_id)
        if bloquear:
            query = query.with_for_update()
        return self.session.exec(query).first()

    def list_by_usuario(
        self, usuario_id: int | None, skip: int, limit: int, estado: EstadoPedido | None
    ) -> tuple[int, list[Pedido]]:
        filtros = []
        if usuario_id is not None:
            filtros.append(Pedido.usuario_id == usuario_id)
        if estado is not None:
            filtros.append(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filtros)).one()
        query = (
            select(Pedido).where(*filtros).options(selectinload(Pedido.items))
            .order_by(Pedido.id.desc()).offset(skip).limit(limit)
        )
        return total, list(self.session.exec(query).all())

    def count_by_estado(self) -> dict[str, int]:
        query = select(Pedido.estado, func.count()).group_by(Pedido.estado)
        return dict(self.session.exec(query).all())

    def count_by_dia(self, inicio: datetime) -> int:
        query = select(func.count()).select_from(Pedido).where(
            Pedido.created_at >= inicio, Pedido.created_at < inicio + timedelta(days=1),
        )
        return self.session.exec(query).one()

    def suma_por_estado(self, estado: EstadoPedido) -> float:
        query = select(func.coalesce(func.sum(Pedido.total), 0.0)).where(Pedido.estado == estado)
        return self.session.exec(query).one()
