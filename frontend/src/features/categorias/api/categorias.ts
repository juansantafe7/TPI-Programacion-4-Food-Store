import { axiosInstance } from "@/shared/api/axiosInstance"
import type { Categoria, CategoriaDatos } from "../types/categoria"

export const listarCategorias = async () => (await axiosInstance.get<Categoria[]>("/categorias")).data
export const crearCategoria = async (data: CategoriaDatos) => (await axiosInstance.post<Categoria>("/categorias", data)).data
export const actualizarCategoria = async (id: number, data: Partial<CategoriaDatos>) => (await axiosInstance.put<Categoria>(`/categorias/${id}`, data)).data
export const anularCategoria = async (id: number) => { await axiosInstance.delete(`/categorias/${id}`) }
