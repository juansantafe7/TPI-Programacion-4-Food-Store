from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from app.core.deps import ActiveUser, AdminUser
from app.modules.pedidos.schemas import CambioEstado, EstadoPedido, PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.service import PedidoAjeno, PedidoNoEncontrado, PedidoService, ProductoNoEncontrado, ReglaPedido
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])
PedidoId = Annotated[int, Path(gt=0)]


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


def get_pedido_write_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork(escritura=True))


Service = Annotated[PedidoService, Depends(get_pedido_service)]
WriteService = Annotated[PedidoService, Depends(get_pedido_write_service)]


@router.post("", status_code=201, response_model=PedidoRead)
def crear(data: PedidoCreate, user: ActiveUser, service: WriteService) -> PedidoRead:
    try:
        return service.crear(data, user.id)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, str(error)) from error
    except ReglaPedido as error:
        raise HTTPException(400, str(error)) from error


@router.get("", response_model=PedidosPaginados)
def listar(
    user: ActiveUser, service: Service, skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20, estado: EstadoPedido | None = None,
) -> PedidosPaginados:
    return service.listar(user, skip, limit, estado)


@router.get("/resumen", response_model=ResumenPedidos)
def resumen(_: AdminUser, service: Service) -> ResumenPedidos:
    return service.resumen()


@router.get("/{id}", response_model=PedidoRead)
def detalle(id: PedidoId, user: ActiveUser, service: Service) -> PedidoRead:
    try:
        return service.detalle(id, user)
    except PedidoNoEncontrado as error:
        raise HTTPException(404, str(error)) from error
    except PedidoAjeno as error:
        raise HTTPException(403, str(error)) from error


@router.patch("/{id}/estado", response_model=PedidoRead)
def cambiar_estado(id: PedidoId, data: CambioEstado, _: AdminUser, service: WriteService) -> PedidoRead:
    try:
        return service.cambiar_estado(id, data.estado)
    except (PedidoNoEncontrado, ProductoNoEncontrado) as error:
        raise HTTPException(404, str(error)) from error
    except ReglaPedido as error:
        raise HTTPException(400, str(error)) from error


@router.patch("/{id}/cancelar", response_model=PedidoRead)
def cancelar(id: PedidoId, user: ActiveUser, service: WriteService) -> PedidoRead:
    try:
        return service.cancelar(id, user.id)
    except (PedidoNoEncontrado, ProductoNoEncontrado) as error:
        raise HTTPException(404, str(error)) from error
    except PedidoAjeno as error:
        raise HTTPException(403, str(error)) from error
    except ReglaPedido as error:
        raise HTTPException(400, str(error)) from error
