import { axiosInstance } from "@/shared/api/axiosInstance"
import type { Usuario } from "@/features/usuarios/types/usuario"
import type { Registro } from "../types/auth"

export const registrar = async (data: Registro) => (await axiosInstance.post<Usuario>("/auth/register", data)).data

export async function iniciarSesion(username: string, password: string) {
  await axiosInstance.post("/auth/token", new URLSearchParams({ username, password }))
}

export async function cerrarSesion() {
  await axiosInstance.post("/auth/logout")
}

export const perfil = async () => (await axiosInstance.get<Usuario>("/auth/me")).data
