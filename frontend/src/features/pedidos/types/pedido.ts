export const estadosPedido = ["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"] as const
export type EstadoPedido = typeof estadosPedido[number]
export type FormaPago = "EFECTIVO" | "TRANSFERENCIA"

export interface DetallePedido {
  producto_id: number
  nombre_producto: string
  precio_unitario: number
  cantidad: number
  subtotal: number
}

export interface PedidoDatos {
  items: { producto_id: number; cantidad: number }[]
  forma_pago: FormaPago
  direccion_entrega: string
  notas: string | null
}

export interface Pedido extends Omit<PedidoDatos, "items"> {
  id: number
  usuario_id: number
  estado: EstadoPedido
  total: number
  created_at: string
  updated_at: string
  items: DetallePedido[]
}

export interface PedidosPaginados {
  total: number
  items: Pedido[]
}

export interface ResumenPedidos {
  pendientes: number
  en_preparacion: number
  entregados: number
  cancelados: number
  pedidos_hoy: number
  ingresos_entregados: number
}
