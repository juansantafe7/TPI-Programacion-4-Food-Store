from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def registrar(self, data: UserCreate) -> UserPublic:
        email = str(data.email).lower()
        with UsuarioUnitOfWork(escritura=True) as uow:
            if uow.usuarios.get_by_username(data.username):
                raise HTTPException(status_code=409, detail="El usuario ya está registrado")
            if uow.usuarios.get_by_email(email):
                raise HTTPException(status_code=409, detail="El email ya está registrado")
            try:
                user = uow.usuarios.add(Usuario(
                    username=data.username, full_name=data.full_name, email=email,
                    hashed_password=hash_password(data.password),
                ))
            except IntegrityError as error:
                raise HTTPException(status_code=409, detail="El usuario o el email ya están registrados") from error
            return UserPublic.model_validate(user)

    def autenticar(self, username: str, password: str) -> str:
        with UsuarioUnitOfWork() as uow:
            user = uow.usuarios.get_by_username(username.strip())
            if user is None or len(password.encode()) > 72 or not verify_password(password, user.hashed_password):
                raise HTTPException(status_code=401, detail="Credenciales incorrectas")
            if user.disabled:
                raise HTTPException(status_code=400, detail="Cuenta de usuario desactivada")
            return create_access_token(str(user.id))
