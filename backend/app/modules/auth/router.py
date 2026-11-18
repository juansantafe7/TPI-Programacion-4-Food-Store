from typing import Annotated
from urllib.parse import urlsplit

from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import ActiveUser
from app.modules.auth.schemas import AuthMessage
from app.modules.auth.service import AuthService
from app.modules.usuarios.schemas import UserCreate, UserPublic

router = APIRouter(prefix="/auth", tags=["Autenticación"])
Auth = Annotated[AuthService, Depends()]
secure_cookie = urlsplit(settings.FRONTEND_ORIGIN).scheme == "https"


@router.post("/register", response_model=UserPublic, status_code=201)
def register(data: UserCreate, service: Auth) -> UserPublic:
    return service.registrar(data)


@router.post("/token", response_model=AuthMessage)
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response, service: Auth) -> AuthMessage:
    response.set_cookie(
        "access_token", service.autenticar(form.username, form.password),
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True, samesite="lax", secure=secure_cookie,
    )
    return AuthMessage(message="Login exitoso")


@router.post("/logout", response_model=AuthMessage)
def logout(response: Response) -> AuthMessage:
    response.delete_cookie("access_token", httponly=True, samesite="lax", secure=secure_cookie)
    return AuthMessage(message="Sesión cerrada")


@router.get("/me", response_model=UserPublic)
def me(user: ActiveUser) -> UserPublic:
    return user
