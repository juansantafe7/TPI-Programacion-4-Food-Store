import { axiosInstance } from "@/shared/api/axiosInstance"
import type { Usuario } from "../types/usuario"

export const listarUsuarios = async () => (await axiosInstance.get<Usuario[]>("/admin/usuarios")).data
export const cambiarEstadoUsuario = async (id: number, activar: boolean) =>
  (await axiosInstance.post<Usuario>(`/admin/usuarios/${id}/${activar ? "activar" : "desactivar"}`)).data
