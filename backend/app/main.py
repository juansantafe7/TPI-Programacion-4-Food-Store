from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app.modules.auth.router import router as auth
from app.modules.categorias.router import router as categorias
from app.modules.pedidos.router import router as pedidos
from app.modules.productos.router import router as productos
from app.modules.usuarios.router import router as usuarios


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_all_tables()
    yield


app = FastAPI(title="Food Store", description="Catálogo y gestión de pedidos de comida.", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=[settings.FRONTEND_ORIGIN], allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"], allow_headers=["Content-Type"],
)
for router in (auth, usuarios, categorias, productos, pedidos):
    app.include_router(router, prefix="/api/v1")
