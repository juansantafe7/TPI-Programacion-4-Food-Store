import type { EstadoPedido } from "@/features/pedidos/types/pedido"

export const estadoLabel: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente", EN_PREPARACION: "En preparación", ENTREGADO: "Entregado", CANCELADO: "Cancelado",
}
const colores: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-[#f8e8bb] text-[#73500e]", EN_PREPARACION: "bg-[#e9eafa] text-[#494073]",
  ENTREGADO: "bg-[#e5edd7] text-[#3b5729]", CANCELADO: "bg-[#f8e4dc] text-[#85332a]",
}

export function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${colores[estado]}`}>{estadoLabel[estado]}</span>
}
