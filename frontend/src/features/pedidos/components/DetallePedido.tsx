import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { dinero, fecha } from "@/shared/formato"
import { BadgeEstado } from "@/shared/ui/BadgeEstado"
import { Modal } from "@/shared/ui/Modal"
import { useAuthStore } from "@/store/authStore"
import { useDetallePedido } from "../hooks/usePedidos"

export function DetallePedido({ id, cerrar }: { id: number; cerrar: () => void }) {
  const usuarioId = useAuthStore((state) => state.usuario?.id)
  const query = useDetallePedido(id, usuarioId)
  const pedido = query.data
  return <Modal title={`Pedido #${id}`} onClose={cerrar}>
    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {pedido && <div className="grid gap-4">
      <p className="flex flex-wrap items-center justify-between gap-2"><BadgeEstado estado={pedido.estado} /><span className="text-sm text-[#625c49]">{fecha(pedido.created_at)}</span></p>
      <dl className="grid gap-2 text-sm">
        <div><dt className="font-bold">Entrega</dt><dd>{pedido.direccion_entrega}</dd></div>
        <div><dt className="font-bold">Forma de pago</dt><dd>{pedido.forma_pago === "EFECTIVO" ? "Efectivo" : "Transferencia"}</dd></div>
        {pedido.notas && <div><dt className="font-bold">Notas</dt><dd>{pedido.notas}</dd></div>}
      </dl>
      <ul className="divide-y divide-[#e6e0d1] border-y border-[#e6e0d1]">
        {pedido.items.map((item) => <li key={item.producto_id} className="flex justify-between gap-3 py-2.5 text-sm">
          <span>{item.cantidad} × {item.nombre_producto} <span className="text-[#625c49]">({dinero(item.precio_unitario)} c/u)</span></span>
          <strong>{dinero(item.subtotal)}</strong>
        </li>)}
      </ul>
      <p className="flex justify-between gap-3 font-bold"><span>Total</span><span>{dinero(pedido.total)}</span></p>
    </div>}
  </Modal>
}
