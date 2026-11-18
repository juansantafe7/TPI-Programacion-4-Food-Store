from typing import Self

from sqlalchemy import text

from app.core.database import engine, session_factory


class UnitOfWork:
    def __init__(self, *, escritura: bool = False) -> None:
        self.escritura = escritura

    def __enter__(self) -> Self:
        self.session = session_factory()
        try:
            if self.escritura and engine.dialect.name == "sqlite":
                self.session.execute(text("BEGIN IMMEDIATE"))
            self.configurar_repositorios()
        except Exception:
            self.session.close()
            raise
        return self

    def configurar_repositorios(self) -> None:
        pass

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()
