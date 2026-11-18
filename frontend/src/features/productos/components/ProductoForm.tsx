import { useForm } from "@tanstack/react-form"
import type { Categoria } from "@/features/categorias/types/categoria"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, Select, Textarea, primerError } from "@/shared/ui/Input"
import type { Producto, ProductoDatos } from "../types/producto"

export function ProductoForm({ producto, categorias, guardar, error, pendiente }: {
  producto?: Producto; categorias: Categoria[]; guardar: (data: ProductoDatos) => Promise<void>; error: unknown; pendiente: boolean
}) {
  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      imagen_url: producto?.imagen_url ?? "",
      precio_base: producto ? String(producto.precio_base) : "",
      stock: String(producto?.stock ?? 0),
      disponible: producto?.disponible ?? true,
      categoria_id: producto ? String(producto.categoria_id) : "",
    },
    onSubmit: async ({ value }) => guardar({
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim() || null,
      imagen_url: value.imagen_url.trim() || null,
      precio_base: Number(value.precio_base),
      stock: Number(value.stock),
      disponible: value.disponible,
      categoria_id: Number(value.categoria_id),
    }),
  })

  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
    <form.Field name="nombre" validators={{ onChange: ({ value }) => value.trim() ? undefined : "Ingresá un nombre" }}>
      {(field) => <Input label="Nombre" required value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
    </form.Field>

    <form.Field name="descripcion">
      {(field) => <Textarea label="Descripción" rows={2} value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} />}
    </form.Field>

    <form.Field name="imagen_url">
      {(field) => (
        <div className="grid gap-2">
          <Input
            label="Ruta o URL de imagen (opcional)"
            placeholder="/images/products/hamburguesa-clasica.png"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
          {field.state.value.trim() && (
            <img
              src={field.state.value}
              alt="Vista previa del producto"
              className="h-40 w-full rounded-xl border bg-[#f7f4ee] object-contain"
            />
          )}
        </div>
      )}
    </form.Field>

    <div className="grid gap-3 sm:grid-cols-2">
      <form.Field name="precio_base" validators={{ onChange: ({ value }) => value && Number.isFinite(Number(value)) && Number(value) >= 0 ? undefined : "Ingresá un precio mayor o igual a cero" }}>
        {(field) => <Input label="Precio base" type="number" min={0} step="0.01" required value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
      </form.Field>

      <form.Field name="categoria_id">
        {(field) => <Select label="Categoría" required value={field.state.value} onChange={(event) => field.handleChange(event.target.value)}>
          <option value="">Seleccioná una categoría</option>
          {producto && !categorias.some((item) => item.id === producto.categoria_id) && <option value={producto.categoria_id}>{producto.categoria.nombre} (dada de baja)</option>}
          {categorias.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
        </Select>}
      </form.Field>
    </div>

    {!producto && <>
      <form.Field name="stock" validators={{ onChange: ({ value }) => value && Number.isSafeInteger(Number(value)) && Number(value) >= 0 ? undefined : "Ingresá un entero mayor o igual a cero" }}>
        {(field) => <Input label="Stock inicial" type="number" min={0} max={2147483647} step={1} required value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
      </form.Field>

      <form.Field name="disponible">
        {(field) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.state.value} onChange={(event) => field.handleChange(event.target.checked)} /> Disponible para vender</label>}
      </form.Field>
    </>}

    {error !== null && <EstadoError error={error} />}
    <Button type="submit" disabled={pendiente}>Guardar producto</Button>
  </form>
}