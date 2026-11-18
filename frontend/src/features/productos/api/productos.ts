import { axiosInstance } from "@/shared/api/axiosInstance"
import type { FiltrosProductos, Producto, ProductoDatos, ProductosPaginados } from "../types/producto"

export const listarProductos = async (params: FiltrosProductos) => (await axiosInstance.get<ProductosPaginados>("/productos", { params })).data
export const crearProducto = async (data: ProductoDatos) => (await axiosInstance.post<Producto>("/productos", data)).data
export const actualizarProducto = async (id: number, data: Partial<ProductoDatos>) => (await axiosInstance.put<Producto>(`/productos/${id}`, data)).data
export const actualizarStock = async (id: number, data: Pick<ProductoDatos, "stock" | "disponible">) => (await axiosInstance.patch<Producto>(`/productos/${id}/stock`, data)).data
export const anularProducto = async (id: number) => { await axiosInstance.delete(`/productos/${id}`) }
