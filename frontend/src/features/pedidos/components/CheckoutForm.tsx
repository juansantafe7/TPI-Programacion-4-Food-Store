import { useForm } from "@tanstack/react-form"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, Select, Textarea, primerError } from "@/shared/ui/Input"
import type { FormaPago, PedidoDatos } from "../types/pedido"

type DatosEntrega = Omit<PedidoDatos, "items" | "notas"> & { notas: string }

export function CheckoutForm({ guardar, error, pendiente }: {
  guardar: (data: DatosEntrega) => Promise<void>; error: unknown; pendiente: boolean
}) {
  const inicial: DatosEntrega = { direccion_entrega: "", forma_pago: "EFECTIVO", notas: "" }
  const form = useForm({ defaultValues: inicial, onSubmit: async ({ value }) => guardar(value) })
  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
    <form.Field name="direccion_entrega" validators={{ onChange: ({ value }) =>
      value.trim().length < 5 ? "Ingresá una dirección de al menos 5 caracteres" : undefined,
    }}>
      {(field) => <Input label="Dirección de entrega" autoComplete="street-address" required minLength={5} maxLength={200} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} onBlur={field.handleBlur} error={primerError(field.state.meta.errors)} />}
    </form.Field>
    <form.Field name="forma_pago">
      {(field) => <Select label="Forma de pago" value={field.state.value} onChange={(event) => field.handleChange(event.target.value as FormaPago)}>
        <option value="EFECTIVO">Efectivo</option><option value="TRANSFERENCIA">Transferencia</option>
      </Select>}
    </form.Field>
    <form.Field name="notas">
      {(field) => <Textarea label="Notas (opcional)" rows={3} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />}
    </form.Field>
    {error !== null && <EstadoError error={error} />}
    <Button type="submit" disabled={pendiente}>{pendiente ? "Confirmando…" : "Confirmar pedido"}</Button>
  </form>
}
