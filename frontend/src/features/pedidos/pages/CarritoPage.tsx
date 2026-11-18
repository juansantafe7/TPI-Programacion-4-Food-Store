import { Link } from "react-router-dom"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoVacio } from "@/shared/components/Estados"
import { dinero } from "@/shared/formato"
import { Button, buttonLink } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { useCartStore } from "@/store/cartStore"

export function CarritoPage() {
  const { items, cambiarCantidad, quitar, vaciar, total } = useCartStore()
  return <>
    <Encabezado titulo="Tu carrito" accion={<Link to="/" className="btn-secondary">Seguir comprando</Link>} />
    {!items.length ? <EstadoVacio text="Todavía no agregaste productos al carrito." /> :
      <div className="grid items-start gap-5 lg:grid-cols-[2fr_1fr]">
        <Card className="divide-y divide-[#ede8da]">
          {items.map((item) => <div key={item.producto_id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
            <div className="min-w-32"><p className="font-semibold">{item.nombre}</p><p className="text-sm text-[#625c49]">{dinero(item.precio_unitario)} por unidad</p></div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" aria-label={`Restar una unidad de ${item.nombre}`} disabled={item.cantidad <= 1} onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}>−</Button>
              <span aria-label="Cantidad">{item.cantidad}</span>
              <Button variant="secondary" aria-label={`Sumar una unidad de ${item.nombre}`} onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}>+</Button>
            </div>
            <strong>{dinero(item.precio_unitario * item.cantidad)}</strong>
            <Button variant="danger" onClick={() => quitar(item.producto_id)}>Quitar</Button>
          </div>)}
        </Card>
        <Card className="grid gap-4">
          <p className="flex justify-between gap-3 text-lg"><span>Total</span><strong>{dinero(total())}</strong></p>
          <Link className={buttonLink} to="/checkout">Continuar al checkout</Link>
          <Button variant="secondary" onClick={vaciar}>Vaciar carrito</Button>
        </Card>
      </div>}
  </>
}
