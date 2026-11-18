import { useState } from "react"
import { useLocation } from "react-router-dom"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, EstadoVacio, Skeleton } from "@/shared/components/Estados"
import { Paginacion } from "@/shared/components/Paginacion"
import { dinero, fecha } from "@/shared/formato"
import { BadgeEstado } from "@/shared/ui/BadgeEstado"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { Modal } from "@/shared/ui/Modal"
import { useAuthStore } from "@/store/authStore"
import { DetallePedido } from "../components/DetallePedido"
import { useCancelarPedido, useMisPedidos } from "../hooks/usePedidos"

const limite = 10

export function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [seleccion, setSeleccion] = useState<number | null>(null)
  const [confirmar, setConfirmar] = useState<number | null>(null)
  const admin = useAuthStore((state) => state.usuario?.role === "admin")
  const usuarioId = useAuthStore((state) => state.usuario?.id)
  const creador: unknown = useLocation().state?.creado
  const cancelar = useCancelarPedido()
  const pedidos = useMisPedidos({ skip: pagina * limite, limit: limite }, usuarioId, admin)
  const lista = pedidos.data?.items ?? []
  return <>
    <Encabezado titulo="Mis pedidos" descripcion={admin ? "Tus compras con la cuenta de administración." : "Consultá el estado y el detalle de tus compras."} />
    {typeof creador === "number" && <p role="status" className="mb-4 rounded-xl bg-[#e7eedb] p-3 text-[#345022]">Pedido #{creador} confirmado.</p>}
    {pedidos.isPending && <Skeleton />}
    {pedidos.isError && <EstadoError error={pedidos.error} onRetry={() => void pedidos.refetch()} />}
    {pedidos.data && <>
      {lista.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{lista.map((pedido) => <Card key={pedido.id}>
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-bold">Pedido #{pedido.id}</h2><BadgeEstado estado={pedido.estado} /></div>
        <p className="my-2 text-sm text-[#625c49]">{fecha(pedido.created_at)} · {dinero(pedido.total)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setSeleccion(pedido.id)}>Ver detalle</Button>
          {pedido.estado === "PENDIENTE" && <Button variant="danger" onClick={() => { cancelar.reset(); setConfirmar(pedido.id) }}>Cancelar pedido</Button>}
        </div>
      </Card>)}</div> : <EstadoVacio text="No hay pedidos propios en esta página." />}
      <Paginacion pagina={pagina} limite={limite} total={pedidos.data.total} cambiar={setPagina} />
    </>}
    {seleccion !== null && <DetallePedido id={seleccion} cerrar={() => setSeleccion(null)} />}
    {confirmar !== null && <Modal title={`Cancelar pedido #${confirmar}`} ocupado={cancelar.isPending} onClose={() => setConfirmar(null)}>
      <p className="mb-4 text-sm">Las unidades de este pedido volverán al stock.</p>
      {cancelar.isError && <EstadoError error={cancelar.error} />}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" disabled={cancelar.isPending} onClick={() => setConfirmar(null)}>Volver</Button>
        <Button variant="danger" disabled={cancelar.isPending} onClick={() => cancelar.mutate(confirmar, { onSuccess: () => setConfirmar(null) })}>Confirmar cancelación</Button>
      </div>
    </Modal>}
  </>
}
