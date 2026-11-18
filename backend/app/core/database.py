from collections.abc import Iterator
from datetime import datetime, timezone

from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

if engine.dialect.name == "sqlite":
    @event.listens_for(engine, "connect")
    def sqlite_foreign_keys(connection, _record) -> None:
        connection.execute("PRAGMA foreign_keys = ON")


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def create_all_tables() -> None:
    from app.modules.categorias import models as categorias
    from app.modules.pedidos import models as pedidos
    from app.modules.productos import models as productos
    from app.modules.usuarios import models as usuarios

    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    return Session(engine, expire_on_commit=False)


def get_session() -> Iterator[Session]:
    with session_factory() as session:
        yield session
