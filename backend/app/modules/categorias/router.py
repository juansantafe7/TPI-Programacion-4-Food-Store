from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Response

from app.core.deps import AdminUser
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import CategoriaNoEncontrada, CategoriaService, NombreDuplicado
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorías"])
CategoriaId = Annotated[int, Path(gt=0)]


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


def get_categoria_write_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork(escritura=True))


Service = Annotated[CategoriaService, Depends(get_categoria_service)]
WriteService = Annotated[CategoriaService, Depends(get_categoria_write_service)]


@router.get("", response_model=list[CategoriaRead])
def listar(service: Service) -> list[CategoriaRead]:
    return service.listar()


@router.get("/{id}", response_model=CategoriaRead)
def detalle(id: CategoriaId, service: Service) -> CategoriaRead:
    try:
        return service.detalle(id)
    except CategoriaNoEncontrada as error:
        raise HTTPException(404, str(error)) from error


@router.post("", status_code=201, response_model=CategoriaRead)
def crear(data: CategoriaCreate, _: AdminUser, service: WriteService) -> CategoriaRead:
    try:
        return service.crear(data)
    except NombreDuplicado as error:
        raise HTTPException(409, str(error)) from error


@router.put("/{id}", response_model=CategoriaRead)
def actualizar(id: CategoriaId, data: CategoriaUpdate, _: AdminUser, service: WriteService) -> CategoriaRead:
    try:
        return service.actualizar(id, data)
    except CategoriaNoEncontrada as error:
        raise HTTPException(404, str(error)) from error
    except NombreDuplicado as error:
        raise HTTPException(409, str(error)) from error


@router.delete("/{id}", status_code=204)
def anular(id: CategoriaId, _: AdminUser, service: WriteService) -> Response:
    try:
        service.anular(id)
    except CategoriaNoEncontrada as error:
        raise HTTPException(404, str(error)) from error
    return Response(status_code=204)
