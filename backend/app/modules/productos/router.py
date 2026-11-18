from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response

from app.core.deps import AdminUser
from app.modules.productos.schemas import ProductoCreate, ProductoRead, ProductoStockUpdate, ProductoUpdate, ProductosPaginados
from app.modules.productos.service import CategoriaNoEncontrada, ProductoNoEncontrado, ProductoService
from app.modules.productos.unit_of_work import ProductoUnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])
ProductoId = Annotated[int, Path(gt=0)]


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


def get_producto_write_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork(escritura=True))


Service = Annotated[ProductoService, Depends(get_producto_service)]
WriteService = Annotated[ProductoService, Depends(get_producto_write_service)]


@router.get("", response_model=ProductosPaginados)
def listar(
    service: Service, skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20, search: str | None = None,
    categoria_id: Annotated[int | None, Query(gt=0)] = None, disponible: bool | None = None,
) -> ProductosPaginados:
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get("/{id}", response_model=ProductoRead)
def detalle(id: ProductoId, service: Service) -> ProductoRead:
    try:
        return service.detalle(id)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, str(error)) from error


@router.post("", status_code=201, response_model=ProductoRead)
def crear(data: ProductoCreate, _: AdminUser, service: WriteService) -> ProductoRead:
    try:
        return service.crear(data)
    except CategoriaNoEncontrada as error:
        raise HTTPException(404, str(error)) from error


@router.put("/{id}", response_model=ProductoRead)
def actualizar(id: ProductoId, data: ProductoUpdate, _: AdminUser, service: WriteService) -> ProductoRead:
    try:
        return service.actualizar(id, data)
    except (CategoriaNoEncontrada, ProductoNoEncontrado) as error:
        raise HTTPException(404, str(error)) from error


@router.patch("/{id}/stock", response_model=ProductoRead)
def cambiar_stock(id: ProductoId, data: ProductoStockUpdate, _: AdminUser, service: WriteService) -> ProductoRead:
    try:
        return service.cambiar_stock(id, data)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, str(error)) from error


@router.delete("/{id}", status_code=204)
def anular(id: ProductoId, _: AdminUser, service: WriteService) -> Response:
    try:
        service.anular(id)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, str(error)) from error
    return Response(status_code=204)
