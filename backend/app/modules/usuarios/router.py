from typing import Annotated

from fastapi import APIRouter, Depends, Path

from app.core.deps import AdminUser
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios"])
UsuarioId = Annotated[int, Path(gt=0)]
Service = Annotated[UsuarioService, Depends()]


@router.get("", response_model=list[UserPublic])
def listar(_: AdminUser, service: Service) -> list[UserPublic]:
    return service.listar()


@router.post("/{id}/activar", response_model=UserPublic)
def activar(id: UsuarioId, admin: AdminUser, service: Service) -> UserPublic:
    return service.cambiar_estado(id, False, admin.id)


@router.post("/{id}/desactivar", response_model=UserPublic)
def desactivar(id: UsuarioId, admin: AdminUser, service: Service) -> UserPublic:
    return service.cambiar_estado(id, True, admin.id)
