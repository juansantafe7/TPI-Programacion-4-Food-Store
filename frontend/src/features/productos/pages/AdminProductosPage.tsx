import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useCategorias } from "@/features/categorias/hooks/useCategorias"
import { Confirmacion } from "@/shared/components/Confirmacion"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { TablaAdmin } from "@/shared/components/TablaAdmin"
import { Paginacion } from "@/shared/components/Paginacion"
import { dinero } from "@/shared/formato"
import { Button } from "@/shared/ui/Button"
import { Modal } from "@/shared/ui/Modal"
import { ProductoForm } from "../components/ProductoForm"
import { StockForm } from "../components/StockForm"
import { useMutacionesProductos, useProductos } from "../hooks/useProductos"
import type { Producto } from "../types/producto"

const lote = 100

export function AdminProductosPage() {
  const [pagina, setPagina] = useState(0)
  const query = useProductos({ limit: lote, skip: pagina * lote })
  const categorias = useCategorias()
  const { guardar, stock, anular } = useMutacionesProductos()
  const [formulario, setFormulario] = useState<Producto | "nuevo" | null>(null)
  const [editarStock, setEditarStock] = useState<Producto | null>(null)
  const [baja, setBaja] = useState<Producto | null>(null)

  const abrir = (producto: Producto | "nuevo") => {
    guardar.reset()
    setFormulario(producto)
  }

  const columnas: ColumnDef<Producto>[] = [
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) => row.original.imagen_url
        ? <img src={row.original.imagen_url} alt={row.original.nombre} className="h-16 w-20 rounded-lg bg-[#f7f4ee] object-contain" />
        : <span className="text-sm text-[#7b7666]">Sin imagen</span>,
    },
    { accessorKey: "nombre", header: "Nombre" },
    { id: "categoria", header: "Categoría", accessorFn: (producto) => producto.categoria.nombre },
    { accessorKey: "precio_base", header: "Precio", cell: ({ row }) => dinero(row.original.precio_base) },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "disponible", header: "Venta", cell: ({ row }) => row.original.disponible ? "Habilitada" : "Pausada" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={!categorias.data} onClick={() => abrir(row.original)}>Editar</Button>
        <Button variant="secondary" onClick={() => { stock.reset(); setEditarStock(row.original) }}>Stock y venta</Button>
        <Button variant="danger" onClick={() => { anular.reset(); setBaja(row.original) }}>Dar de baja</Button>
      </div>,
    },
  ]

  return <>
    <Encabezado titulo="Productos" accion={<Button disabled={!categorias.data?.length} onClick={() => abrir("nuevo")}>Nuevo producto</Button>} />

    {categorias.isError && <div className="mb-3"><EstadoError error={categorias.error} onRetry={() => void categorias.refetch()} /></div>}
    {categorias.data?.length === 0 && <p className="mb-3 text-sm text-[#625c49]">Creá una categoría activa antes de cargar productos.</p>}

    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {query.data && <>
      <TablaAdmin columns={columnas} rows={query.data.items} empty="No hay productos activos en esta página." />
      <Paginacion pagina={pagina} total={query.data.total} limite={lote} cambiar={setPagina} />
    </>}

    {formulario !== null && categorias.data && <Modal title={formulario === "nuevo" ? "Nuevo producto" : "Editar producto"} onClose={() => setFormulario(null)} ocupado={guardar.isPending}>
      <ProductoForm producto={formulario === "nuevo" ? undefined : formulario} categorias={categorias.data} error={guardar.error} pendiente={guardar.isPending} guardar={async (data) => {
        await guardar.mutateAsync({ id: formulario === "nuevo" ? undefined : formulario.id, data, categoriaCambiada: formulario !== "nuevo" && data.categoria_id !== formulario.categoria_id })
        setFormulario(null)
      }} />
    </Modal>}

    {editarStock && <Modal title={`Stock y venta · ${editarStock.nombre}`} onClose={() => setEditarStock(null)} ocupado={stock.isPending}>
      <StockForm producto={editarStock} error={stock.error} pendiente={stock.isPending} guardar={async (data) => {
        await stock.mutateAsync({ id: editarStock.id, data })
        setEditarStock(null)
      }} />
    </Modal>}

    {baja && <Confirmacion titulo={`Dar de baja ${baja.nombre}`} texto="El producto se retirará del catálogo. Los pedidos anteriores conservarán sus datos." accion="Dar de baja" error={anular.error} pendiente={anular.isPending} cerrar={() => setBaja(null)} confirmar={() => anular.mutate(baja.id, { onSuccess: () => setBaja(null) })} />}
  </>
}