from sqlalchemy.exc import IntegrityError

from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork) -> None:
        self.uow = uow

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(row) for row in uow.categorias.listar_activas()]

    def detalle(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._activa(uow, categoria_id))

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        try:
            with self.uow as uow:
                self._validar_nombre(uow, data.nombre)
                categoria = uow.categorias.add(Categoria.model_validate(data))
                return CategoriaRead.model_validate(categoria)
        except IntegrityError as error:
            raise NombreDuplicado("Ya existe una categoría con ese nombre") from error

    def actualizar(self, categoria_id: int, data: CategoriaUpdate) -> CategoriaRead:
        try:
            with self.uow as uow:
                categoria = self._activa(uow, categoria_id, bloquear=True)
                if data.nombre is not None:
                    self._validar_nombre(uow, data.nombre, categoria_id)
                categoria.sqlmodel_update(data.model_dump(exclude_unset=True))
                return CategoriaRead.model_validate(categoria)
        except IntegrityError as error:
            raise NombreDuplicado("Ya existe una categoría con ese nombre") from error

    def anular(self, categoria_id: int) -> None:
        with self.uow as uow:
            self._activa(uow, categoria_id, bloquear=True).activo = False

    @staticmethod
    def _activa(uow: CategoriaUnitOfWork, categoria_id: int, *, bloquear: bool = False) -> Categoria:
        categoria = uow.categorias.get_by_id(categoria_id, bloquear=bloquear)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada("Categoría no encontrada")
        return categoria

    @staticmethod
    def _validar_nombre(uow: CategoriaUnitOfWork, nombre: str, categoria_id: int | None = None) -> None:
        existente = uow.categorias.get_by_nombre(nombre)
        if existente is not None and existente.id != categoria_id:
            raise NombreDuplicado("Ya existe una categoría con ese nombre")
