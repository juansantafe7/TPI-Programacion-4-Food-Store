import { useState } from "react"
import { Confirmacion } from "@/shared/components/Confirmacion"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { Paginacion } from "@/shared/components/Paginacion"
import { estadoLabel } from "@/shared/ui/BadgeEstado"
import { Select } from "@/shared/ui/Input"
import { useAuthStore } from "@/store/authStore"
import { DetallePedido } from "../components/DetallePedido"
import { TablaPedidos } from "../components/TablaPedidos"
import { useCambiarEstadoPedido, usePedidos } from "../hooks/usePedidos"
import { estadosPedido, type EstadoPedido } from "../types/pedido"

const limite = 20

export function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState<EstadoPedido | "">("")
  const [detalle, setDetalle] = useState<number | null>(null)
  const [cancelar, setCancelar] = useState<number | null>(null)
  const usuarioId = useAuthStore((state) => state.usuario?.id)
  const query = usePedidos({ skip: pagina * limite, limit: limite, estado: estado || undefined }, usuarioId)
  const cambio = useCambiarEstadoPedido()
  return <>
    <Encabezado titulo="Pedidos" />
    <div className="mb-5 max-w-xs"><Select label="Filtrar por estado" value={estado} onChange={(event) => {
      setEstado(event.target.value as EstadoPedido | "")
      setPagina(0)
    }}>
      <option value="">Todos los estados</option>
      {estadosPedido.map((item) => <option key={item} value={item}>{estadoLabel[item]}</option>)}
    </Select></div>
    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {cambio.isError && cancelar === null && <div className="mb-3"><EstadoError error={cambio.error} /></div>}
    {query.data && <>
      <TablaPedidos pedidos={query.data.items} detalle={setDetalle} ocupado={cambio.isPending} cambiar={(id, estado) => {
        cambio.reset()
        if (estado === "CANCELADO") setCancelar(id)
        else cambio.mutate({ id, estado })
      }} />
      <Paginacion pagina={pagina} limite={limite} total={query.data.total} cambiar={setPagina} />
    </>}
    {detalle !== null && <DetallePedido id={detalle} cerrar={() => setDetalle(null)} />}
    {cancelar !== null && <Confirmacion titulo={`Cancelar pedido #${cancelar}`} texto="Al cancelar, las unidades del pedido se restituyen al stock." accion="Confirmar cancelación" error={cambio.error} pendiente={cambio.isPending} cerrar={() => { cambio.reset(); setCancelar(null) }} confirmar={() => cambio.mutate({ id: cancelar, estado: "CANCELADO" }, { onSuccess: () => setCancelar(null) })} />}
  </>
}
