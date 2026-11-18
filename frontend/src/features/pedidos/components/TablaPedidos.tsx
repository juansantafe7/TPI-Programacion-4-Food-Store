import type { ColumnDef } from "@tanstack/react-table"
import { TablaAdmin } from "@/shared/components/TablaAdmin"
import { dinero, fecha } from "@/shared/formato"
import { BadgeEstado } from "@/shared/ui/BadgeEstado"
import { Button } from "@/shared/ui/Button"
import type { EstadoPedido, Pedido } from "../types/pedido"

const siguiente: Partial<Record<EstadoPedido, { estado: EstadoPedido; label: string }>> = {
  PENDIENTE: { estado: "EN_PREPARACION", label: "Preparar" },
  EN_PREPARACION: { estado: "ENTREGADO", label: "Marcar entregado" },
}

export function TablaPedidos({ pedidos, detalle, cambiar, ocupado }: {
  pedidos: Pedido[]; detalle: (id: number) => void; cambiar: (id: number, estado: EstadoPedido) => void; ocupado: boolean
}) {
  const columns: ColumnDef<Pedido>[] = [
    { accessorKey: "id", header: "Pedido", cell: ({ row }) => `#${row.original.id}` },
    { accessorKey: "usuario_id", header: "Cliente", cell: ({ row }) => `#${row.original.usuario_id}` },
    { accessorKey: "created_at", header: "Fecha", cell: ({ row }) => fecha(row.original.created_at) },
    { accessorKey: "estado", header: "Estado", cell: ({ row }) => <BadgeEstado estado={row.original.estado} /> },
    { accessorKey: "total", header: "Total", cell: ({ row }) => dinero(row.original.total) },
    { id: "acciones", header: "Acciones", cell: ({ row }) => {
      const pedido = row.original
      const transicion = siguiente[pedido.estado]
      return <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => detalle(pedido.id)}>Ver detalle</Button>
        {transicion && <>
          <Button variant="secondary" disabled={ocupado} onClick={() => cambiar(pedido.id, transicion.estado)}>{transicion.label}</Button>
          <Button variant="danger" disabled={ocupado} onClick={() => cambiar(pedido.id, "CANCELADO")}>Cancelar</Button>
        </>}
      </div>
    } },
  ]
  return <TablaAdmin columns={columns} rows={pedidos} empty="No hay pedidos para este filtro." />
}
