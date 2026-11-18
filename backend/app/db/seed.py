from sqlalchemy import text

from app.core.database import create_all_tables, engine
from app.core.security import hash_password
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.models import Categoria
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.models import Producto
from app.modules.productos.repository import ProductoRepository
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.repository import UsuarioRepository

CATALOGO = [
    {
        "nombre": "Hamburguesas",
        "descripcion": "Hamburguesas artesanales preparadas al momento con ingredientes frescos y opciones clásicas y veggie.",
        "imagen_url": "/images/categories/hamburguesas.png",
        "productos": [
            {
                "nombre": "Hamburguesa clásica",
                "descripcion": "Carne a la plancha, lechuga fresca, tomate y pan tostado.",
                "precio_base": 7900,
                "stock": 20,
                "imagen_url": "/images/products/hamburguesa-clasica.png",
            },
            {
                "nombre": "Doble cheddar",
                "descripcion": "Dos medallones de carne, cheddar fundido y cebolla caramelizada.",
                "precio_base": 10500,
                "stock": 15,
                "imagen_url": "/images/products/doble-cheddar.png",
            },
            {
                "nombre": "Hamburguesa veggie",
                "descripcion": "Medallón de garbanzos, rúcula, tomate y alioli.",
                "precio_base": 8400,
                "stock": 12,
                "imagen_url": "/images/products/hamburguesa-veggie.png",
            },
        ],
    },
    {
        "nombre": "Pizzas",
        "descripcion": "Pizzas horneadas con masa artesanal, salsa casera y combinaciones clásicas e italianas.",
        "imagen_url": "/images/categories/pizzas.png",
        "productos": [
            {
                "nombre": "Pizza muzzarella",
                "descripcion": "Salsa de tomate, muzzarella gratinada y aceitunas verdes.",
                "precio_base": 11800,
                "stock": 18,
                "imagen_url": "/images/products/pizza-muzzarella.png",
            },
            {
                "nombre": "Pizza napolitana",
                "descripcion": "Tomate fresco, muzzarella y ajo tostado.",
                "precio_base": 13200,
                "stock": 14,
                "imagen_url": "/images/products/pizza-napolitana.png",
            },
            {
                "nombre": "Pizza de rúcula",
                "descripcion": "Rúcula fresca, tomates cherry y láminas de parmesano.",
                "precio_base": 14500,
                "stock": 10,
                "imagen_url": "/images/products/pizza-rucula.png",
            },
        ],
    },
    {
        "nombre": "Bebidas",
        "descripcion": "Bebidas frías para acompañar el pedido, desde opciones naturales hasta agua mineral.",
        "imagen_url": "/images/categories/bebidas.png",
        "productos": [
            {
                "nombre": "Limonada",
                "descripcion": "Limonada natural con menta, hielo y un perfil refrescante.",
                "precio_base": 3200,
                "stock": 24,
                "imagen_url": "/images/products/limonada.png",
            },
            {
                "nombre": "Agua mineral",
                "descripcion": "Botella de agua mineral sin gas de 500 ml.",
                "precio_base": 1800,
                "stock": 30,
                "imagen_url": "/images/products/agua-mineral.png",
            },
        ],
    },
]


def cargar_datos() -> None:
    create_all_tables()
    with UnitOfWork(escritura=True) as uow:
        if engine.dialect.name == "postgresql":
            uow.session.execute(text("SELECT pg_advisory_xact_lock(5173)"))

        usuarios = UsuarioRepository(uow.session)
        categorias = CategoriaRepository(uow.session)
        productos = ProductoRepository(uow.session)

        if usuarios.get_by_username("admin") is None:
            usuarios.add(Usuario(
                username="admin",
                full_name="Administrador Food Store",
                email="admin@foodstore.example",
                hashed_password=hash_password("Admin1234!"),
                role="admin",
            ))

        for categoria_data in CATALOGO:
            categoria = categorias.get_by_nombre(categoria_data["nombre"])
            if categoria is None:
                categoria = categorias.add(Categoria(
                    nombre=categoria_data["nombre"],
                    descripcion=categoria_data["descripcion"],
                    imagen_url=categoria_data["imagen_url"],
                ))

            for item in categoria_data["productos"]:
                producto = productos.get_by_nombre(item["nombre"])
                if producto is None:
                    productos.add(Producto(
                        categoria_id=categoria.id,
                        nombre=item["nombre"],
                        descripcion=item["descripcion"],
                        precio_base=item["precio_base"],
                        imagen_url=item["imagen_url"],
                        stock=item["stock"],
                        disponible=True,
                    ))


if __name__ == "__main__":
    cargar_datos()
    print("Seed completado. Usuario de demostración: admin")