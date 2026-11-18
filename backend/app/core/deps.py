from typing import Annotated

from fastapi import Cookie, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import decode_access_token
from app.modules.usuarios.repository import UsuarioRepository
from app.modules.usuarios.schemas import UserPublic


def get_current_user(
    session: Annotated[Session, Depends(get_session)],
    access_token: Annotated[str | None, Cookie()] = None,
) -> UserPublic:
    invalid = HTTPException(status_code=401, detail="La sesión no es válida o venció")
    payload = decode_access_token(access_token) if access_token else None
    subject = payload.get("sub") if payload else None
    if not isinstance(subject, str) or not subject.isdecimal():
        raise invalid
    user = UsuarioRepository(session).get_by_id(int(subject))
    if user is None:
        raise invalid
    return UserPublic.model_validate(user)


def get_current_active_user(user: Annotated[UserPublic, Depends(get_current_user)]) -> UserPublic:
    if user.disabled:
        raise HTTPException(status_code=400, detail="Cuenta de usuario desactivada")
    return user


def require_role(roles: list[str]):
    def check(user: Annotated[UserPublic, Depends(get_current_active_user)]) -> UserPublic:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Permisos insuficientes")
        return user
    return check


ActiveUser = Annotated[UserPublic, Depends(get_current_active_user)]
AdminUser = Annotated[UserPublic, Depends(require_role(["admin"]))]
