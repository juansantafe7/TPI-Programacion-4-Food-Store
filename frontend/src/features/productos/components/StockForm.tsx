import { useForm } from "@tanstack/react-form"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, primerError } from "@/shared/ui/Input"
import type { Producto, ProductoDatos } from "../types/producto"

export function StockForm({ producto, guardar, error, pendiente }: {
  producto: Producto; guardar: (data: Pick<ProductoDatos, "stock" | "disponible">) => Promise<void>; error: unknown; pendiente: boolean
}) {
  const form = useForm({
    defaultValues: { stock: String(producto.stock), disponible: producto.disponible },
    onSubmit: async ({ value }) => guardar({ ...value, stock: Number(value.stock) }),
  })
  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
    <form.Field name="stock" validators={{ onChange: ({ value }) => value && Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? undefined : "Ingresá un entero mayor o igual a cero" }}>
      {(field) => <Input label="Stock" type="number" min={0} max={2147483647} step={1} required value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
    </form.Field>
    <form.Field name="disponible">
      {(field) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.state.value} onChange={(event) => field.handleChange(event.target.checked)} /> Disponible para vender</label>}
    </form.Field>
    {error !== null && <EstadoError error={error} />}
    <Button type="submit" disabled={pendiente}>Guardar stock</Button>
  </form>
}
