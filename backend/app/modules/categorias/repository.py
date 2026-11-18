from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.models import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        return self.session.exec(select(Categoria).where(Categoria.nombre == nombre)).first()

    def get_by_id(self, entity_id: int, *, bloquear: bool = False) -> Categoria | None:
        query = select(Categoria).where(Categoria.id == entity_id)
        if bloquear:
            query = query.with_for_update()
        return self.session.exec(query).first()

    def listar_activas(self) -> list[Categoria]:
        query = select(Categoria).where(Categoria.activo.is_(True)).order_by(Categoria.id)
        return list(self.session.exec(query).all())
