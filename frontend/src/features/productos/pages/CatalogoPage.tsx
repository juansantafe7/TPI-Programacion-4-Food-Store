import { useDeferredValue, useState } from "react"
import { useCategorias } from "@/features/categorias/hooks/useCategorias"
import { EstadoError, EstadoVacio, Skeleton } from "@/shared/components/Estados"
import { Paginacion } from "@/shared/components/Paginacion"
import { Input, Select } from "@/shared/ui/Input"
import { ProductoCard } from "../components/ProductoCard"
import { useProductos } from "../hooks/useProductos"

const limite = 6

export function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [search, setSearch] = useState("")
  const [categoria, setCategoria] = useState("")
  const busqueda = useDeferredValue(search)
  const categorias = useCategorias()
  const productos = useProductos({
    limit: limite, skip: pagina * limite, search: busqueda || undefined, categoria_id: categoria ? Number(categoria) : undefined,
  })
  return <>
    <section className="mb-7 rounded-[2rem] bg-[#43532c] px-6 py-9 text-white sm:px-10 sm:py-12">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Elegí qué pedir</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#e3e9d6] sm:text-base">Explorá el catálogo y armá tu pedido para recibirlo en tu dirección.</p>
    </section>
    {categorias.data && categorias.data.length > 0 && (
      <section aria-label="Categorías de comida" className="mb-6 grid gap-3 sm:grid-cols-3">
        {categorias.data.map((item) => {
          const seleccionada = categoria === String(item.id)
          return <button
            key={item.id}
            type="button"
            aria-pressed={seleccionada}
            onClick={() => { setCategoria(seleccionada ? "" : String(item.id)); setPagina(0) }}
            className={`overflow-hidden rounded-2xl border bg-white text-left transition-colors hover:border-[#43532c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43532c] ${seleccionada ? "border-[#43532c] ring-2 ring-[#43532c]" : "border-[#e3e0d7]"}`}
          >
            {item.imagen_url && (
              <img src={item.imagen_url} alt="" loading="lazy" className="aspect-[4/3] w-full bg-[#f7f4ee] object-contain" />
            )}
            <div className="p-4">
              <h2 className="font-bold">{item.nombre}</h2>
              {item.descripcion && <p className="mt-1 text-sm leading-relaxed text-[#5d5947]">{item.descripcion}</p>}
            </div>
          </button>
        })}
      </section>
    )}
    <div className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr]">
      <Input label="Buscar productos" placeholder="Ej. pizza" value={search} onChange={(event) => { setSearch(event.target.value); setPagina(0) }} />
      <Select label="Categoría" disabled={categorias.isPending || categorias.isError} value={categoria} onChange={(event) => { setCategoria(event.target.value); setPagina(0) }}>
        <option value="">Todas las categorías</option>
        {categorias.data?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
      </Select>
    </div>
    {categorias.isError && <div className="mb-4"><EstadoError error={categorias.error} onRetry={() => void categorias.refetch()} /></div>}
    {productos.isPending && <Skeleton />}
    {productos.isError && <EstadoError error={productos.error} onRetry={() => void productos.refetch()} />}
    {productos.data && <>
      {productos.data.items.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productos.data.items.map((item) => <ProductoCard key={`${item.id}:${item.imagen_url ?? ""}`} producto={item} />)}
      </div> : <EstadoVacio text="No encontramos productos con esos filtros." />}
      <Paginacion pagina={pagina} total={productos.data.total} limite={limite} cambiar={setPagina} />
    </>}
  </>
}
