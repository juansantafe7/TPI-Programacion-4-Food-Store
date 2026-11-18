from typing import Annotated

from pydantic import Field, StringConstraints, field_validator
from sqlmodel import SQLModel

from app.modules.categorias.schemas import CategoriaRead

NombreProducto = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
Precio = Annotated[float, Field(ge=0, allow_inf_nan=False)]
Stock = Annotated[int, Field(ge=0)]
CategoriaId = Annotated[int, Field(gt=0)]


def normalizar_ruta_imagen(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None


class ProductoCreate(SQLModel):
    nombre: NombreProducto
    descripcion: str | None = None
    precio_base: Precio
    imagen_url: str | None = None
    stock: Stock = 0
    disponible: bool = True
    categoria_id: CategoriaId

    validar_imagen = field_validator("imagen_url")(normalizar_ruta_imagen)


class ProductoUpdate(SQLModel):
    nombre: NombreProducto | None = None
    descripcion: str | None = None
    precio_base: Precio | None = None
    imagen_url: str | None = None
    stock: Stock | None = None
    disponible: bool | None = None
    categoria_id: CategoriaId | None = None

    validar_imagen = field_validator("imagen_url")(normalizar_ruta_imagen)

    @field_validator("nombre", "precio_base", "stock", "disponible", "categoria_id")
    @classmethod
    def rechazar_nulos(cls, value):
        if value is None:
            raise ValueError("El campo no admite un valor nulo")
        return value


class ProductoStockUpdate(SQLModel):
    stock: Stock
    disponible: bool


class ProductoRead(ProductoCreate):
    id: int
    activo: bool
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]