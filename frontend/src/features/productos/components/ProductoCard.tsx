import { useState } from "react"
import { dinero } from "@/shared/formato"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { useCartStore } from "@/store/cartStore"
import type { Producto } from "../types/producto"

export function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((state) => state.agregar)
  const cantidad = useCartStore((state) => state.items.find((item) => item.producto_id === producto.id)?.cantidad ?? 0)
  const [imagenRota, setImagenRota] = useState(false)
  const pausado = !producto.disponible || producto.stock === 0
  return <article aria-label={producto.nombre}>
    <Card className="flex h-full flex-col">
      {producto.imagen_url && !imagenRota && <img className="mb-4 aspect-square w-full rounded-xl bg-[#f7f4ee] object-contain" src={producto.imagen_url} alt={producto.nombre} loading="lazy" onError={() => setImagenRota(true)} />}
      <p className="mb-2 text-xs font-semibold text-[#59653e]">{producto.categoria.nombre}</p>
      <h2 className="text-xl font-bold">{producto.nombre}</h2>
      {producto.descripcion && <p className="mt-2 text-sm leading-relaxed text-[#5d5947]">{producto.descripcion}</p>}
      <div className="mt-auto pt-5">
        <p className="mb-3 flex flex-wrap items-center justify-between gap-2"><strong>{dinero(producto.precio_base)}</strong>
          <span className="text-xs text-[#665e4a]">{producto.disponible ? `Stock: ${producto.stock}` : "Venta pausada"}</span>
        </p>
        <Button className="w-full" disabled={pausado || cantidad >= producto.stock} onClick={() => agregar(producto)}>
          {pausado ? (producto.disponible ? "Sin stock" : "No disponible") : cantidad >= producto.stock ? "Stock en el carrito" : "Agregar al carrito"}
        </Button>
      </div>
    </Card>
  </article>
}
