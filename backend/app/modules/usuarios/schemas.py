from datetime import datetime
from typing import Annotated, Literal

from pydantic import EmailStr, StringConstraints, field_validator
from sqlmodel import Field, SQLModel

Rol = Literal["user", "admin"]
TextoUsuario = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class UserCreate(SQLModel):
    username: TextoUsuario
    full_name: TextoUsuario
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def validar_password(cls, value: str) -> str:
        if len(value.encode()) > 72:
            raise ValueError("La contraseña no puede superar los 72 bytes")
        return value


class UserPublic(SQLModel):
    id: int
    username: str
    full_name: str
    email: str
    role: Rol
    disabled: bool
    created_at: datetime
