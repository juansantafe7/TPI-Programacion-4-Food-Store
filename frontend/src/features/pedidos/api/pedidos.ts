import { axiosInstance } from "@/shared/api/axiosInstance"
import type { EstadoPedido, Pedido, PedidoDatos, PedidosPaginados, ResumenPedidos } from "../types/pedido"

export interface FiltrosPedidos {
  skip: number
  limit: number
  estado?: EstadoPedido
}

export const listarPedidos = async (params: FiltrosPedidos) => (await axiosInstance.get<PedidosPaginados>("/pedidos", { params })).data
export const detallePedido = async (id: number) => (await axiosInstance.get<Pedido>(`/pedidos/${id}`)).data
export const crearPedido = async (data: PedidoDatos) => (await axiosInstance.post<Pedido>("/pedidos", data)).data
export const cancelarPedido = async (id: number) => (await axiosInstance.patch<Pedido>(`/pedidos/${id}/cancelar`)).data
export const cambiarEstadoPedido = async (id: number, estado: EstadoPedido) => (await axiosInstance.patch<Pedido>(`/pedidos/${id}/estado`, { estado })).data
export const resumenPedidos = async () => (await axiosInstance.get<ResumenPedidos>("/pedidos/resumen")).data
