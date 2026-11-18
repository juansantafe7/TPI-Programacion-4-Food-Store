from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def get_by_id(self, entity_id: int, *, bloquear: bool = False) -> Producto | None:
        query = select(Producto).where(Producto.id == entity_id)
        if bloquear:
            query = query.with_for_update()
        return self.session.exec(query).first()

    def search(
        self, skip: int, limit: int, search: str | None, categoria_id: int | None, disponible: bool | None
    ) -> tuple[int, list[Producto]]:
        filtros = [Producto.activo.is_(True)]
        if search and search.strip():
            filtros.append(Producto.nombre.icontains(search.strip(), autoescape=True))
        if categoria_id is not None:
            filtros.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filtros.append(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(Producto).where(*filtros)).one()
        query = (
            select(Producto).where(*filtros).options(selectinload(Producto.categoria))
            .order_by(Producto.id).offset(skip).limit(limit)
        )
        return total, list(self.session.exec(query).all())

    def get_by_nombre(self, nombre: str) -> Producto | None:
        return self.session.exec(select(Producto).where(Producto.nombre == nombre)).first()
