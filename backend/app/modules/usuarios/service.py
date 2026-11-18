from fastapi import HTTPException

from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def listar(self) -> list[UserPublic]:
        with UsuarioUnitOfWork() as uow:
            return [UserPublic.model_validate(user) for user in uow.usuarios.get_all()]

    def cambiar_estado(self, usuario_id: int, disabled: bool, admin_id: int) -> UserPublic:
        if disabled and usuario_id == admin_id:
            raise HTTPException(status_code=400, detail="No podés desactivar tu propia cuenta")
        with UsuarioUnitOfWork(escritura=True) as uow:
            user = uow.usuarios.get_by_id(usuario_id)
            if user is None:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            user.disabled = disabled
            return UserPublic.model_validate(user)
