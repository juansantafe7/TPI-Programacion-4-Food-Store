from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository


class CategoriaUnitOfWork(UnitOfWork):
    def configurar_repositorios(self) -> None:
        self.categorias = CategoriaRepository(self.session)
