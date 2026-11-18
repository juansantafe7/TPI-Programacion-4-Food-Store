import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Confirmacion } from "@/shared/components/Confirmacion"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { TablaAdmin } from "@/shared/components/TablaAdmin"
import { Button } from "@/shared/ui/Button"
import { Modal } from "@/shared/ui/Modal"
import { CategoriaForm } from "../components/CategoriaForm"
import { useCategorias, useMutacionesCategorias } from "../hooks/useCategorias"
import type { Categoria } from "../types/categoria"

export function AdminCategoriasPage() {
  const query = useCategorias()
  const { guardar, anular } = useMutacionesCategorias()
  const [formulario, setFormulario] = useState<Categoria | "nueva" | null>(null)
  const [baja, setBaja] = useState<Categoria | null>(null)
  const abrir = (categoria: Categoria | "nueva") => { guardar.reset(); setFormulario(categoria) }
  const columnas: ColumnDef<Categoria>[] = [
    {
      id: "imagen",
      header: "Imagen",
      cell: ({ row }) => row.original.imagen_url
        ? <img src={row.original.imagen_url} alt={row.original.nombre} loading="lazy" className="h-16 w-20 rounded-lg bg-[#f7f4ee] object-contain" />
        : <span className="text-sm text-[#7b7666]">Sin imagen</span>,
    },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción", cell: ({ row }) => row.original.descripcion || "—" },
    { id: "acciones", header: "Acciones", cell: ({ row }) => <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => abrir(row.original)}>Editar</Button>
      <Button variant="danger" onClick={() => { anular.reset(); setBaja(row.original) }}>Dar de baja</Button>
    </div> },
  ]
  return <>
    <Encabezado titulo="Categorías" accion={<Button onClick={() => abrir("nueva")}>Nueva categoría</Button>} />
    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {query.data && <TablaAdmin columns={columnas} rows={query.data} empty="Todavía no hay categorías activas." />}
    {formulario !== null && <Modal title={formulario === "nueva" ? "Nueva categoría" : "Editar categoría"} onClose={() => setFormulario(null)} ocupado={guardar.isPending}>
      <CategoriaForm categoria={formulario === "nueva" ? undefined : formulario} error={guardar.error} pendiente={guardar.isPending} guardar={async (data) => {
        await guardar.mutateAsync({ id: formulario === "nueva" ? undefined : formulario.id, data })
        setFormulario(null)
      }} />
    </Modal>}
    {baja && <Confirmacion titulo={`Dar de baja ${baja.nombre}`} texto="La categoría dejará de aparecer en el selector. Sus productos seguirán en el catálogo." accion="Dar de baja" error={anular.error} pendiente={anular.isPending} cerrar={() => setBaja(null)} confirmar={() => anular.mutate(baja.id, { onSuccess: () => setBaja(null) })} />}
  </>
}
