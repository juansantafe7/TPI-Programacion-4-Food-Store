from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.repository import ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    def configurar_repositorios(self) -> None:
        self.categorias = CategoriaRepository(self.session)
        self.productos = ProductoRepository(self.session)
