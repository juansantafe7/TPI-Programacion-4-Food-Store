import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { dinero } from "@/shared/formato"
import { TarjetaResumen } from "../components/TarjetaResumen"
import { useResumenPedidos } from "../hooks/usePedidos"

export function AdminResumenPage() {
  const query = useResumenPedidos()
  const data = query.data
  return <>
    <Encabezado titulo="Resumen" descripcion="Estados de los pedidos e ingresos de las entregas confirmadas." />
    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {data && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
      <TarjetaResumen titulo="Pendientes" valor={data.pendientes} />
      <TarjetaResumen titulo="En preparación" valor={data.en_preparacion} />
      <TarjetaResumen titulo="Entregados" valor={data.entregados} />
      <TarjetaResumen titulo="Cancelados" valor={data.cancelados} />
      <TarjetaResumen titulo="Ingresos por entregas" valor={dinero(data.ingresos_entregados)} />
    </div>}
  </>
}
