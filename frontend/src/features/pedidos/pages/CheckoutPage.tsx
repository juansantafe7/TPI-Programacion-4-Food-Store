import { Link, useNavigate } from "react-router-dom"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoVacio } from "@/shared/components/Estados"
import { dinero } from "@/shared/formato"
import { Card } from "@/shared/ui/Card"
import { useCartStore } from "@/store/cartStore"
import { CheckoutForm } from "../components/CheckoutForm"
import { useCrearPedido } from "../hooks/usePedidos"

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, vaciar, total } = useCartStore()
  const crear = useCrearPedido()
  return <>
    <Encabezado titulo="Confirmar pedido" descripcion="Indicá la dirección de entrega y cómo vas a pagar." accion={<Link to="/carrito" className="btn-secondary">Volver al carrito</Link>} />
    {!items.length ? <EstadoVacio text="Agregá productos al carrito para confirmar un pedido." /> :
      <div className="grid items-start gap-5 lg:grid-cols-[2fr_1fr]">
        <Card><CheckoutForm pendiente={crear.isPending} error={crear.error} guardar={async (data) => {
          const pedido = await crear.mutateAsync({
            ...data, direccion_entrega: data.direccion_entrega.trim(), notas: data.notas.trim() || null,
            items: items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad })),
          })
          vaciar()
          navigate("/mis-pedidos", { replace: true, state: { creado: pedido.id } })
        }} /></Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Resumen del carrito</h2>
          <ul className="grid gap-2 text-sm">
            {items.map((item) => <li key={item.producto_id} className="flex justify-between gap-3"><span>{item.cantidad} × {item.nombre}</span><span>{dinero(item.cantidad * item.precio_unitario)}</span></li>)}
          </ul>
          <p className="mt-4 flex justify-between border-t border-[#e6e0d1] pt-3"><span>Total estimado</span><strong>{dinero(total())}</strong></p>
        </Card>
      </div>}
  </>
}
