from typing import Annotated

from pydantic import StringConstraints, field_validator
from sqlmodel import SQLModel

NombreCategoria = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]


def normalizar_ruta_imagen(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None


class CategoriaCreate(SQLModel):
    nombre: NombreCategoria
    descripcion: str | None = None
    imagen_url: str | None = None

    validar_imagen = field_validator("imagen_url")(normalizar_ruta_imagen)


class CategoriaUpdate(SQLModel):
    nombre: NombreCategoria | None = None
    descripcion: str | None = None
    imagen_url: str | None = None

    validar_imagen = field_validator("imagen_url")(normalizar_ruta_imagen)

    @field_validator("nombre")
    @classmethod
    def nombre_obligatorio_si_se_envia(cls, value: str | None) -> str:
        if value is None:
            raise ValueError("El nombre no puede estar vacío")
        return value


class CategoriaRead(CategoriaCreate):
    id: int
    activo: bool