import { useForm } from "@tanstack/react-form"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, Textarea, primerError } from "@/shared/ui/Input"
import type { Categoria, CategoriaDatos } from "../types/categoria"

export function CategoriaForm({ categoria, guardar, error, pendiente }: {
  categoria?: Categoria; guardar: (data: CategoriaDatos) => Promise<void>; error: unknown; pendiente: boolean
}) {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
      imagen_url: categoria?.imagen_url ?? "",
    },
    onSubmit: async ({ value }) => guardar({
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim() || null,
      imagen_url: value.imagen_url.trim() || null,
    }),
  })

  return <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
    <form.Field name="nombre" validators={{ onChange: ({ value }) => value.trim().length < 2 ? "Ingresá al menos 2 caracteres" : undefined }}>
      {(field) => (
        <Input
          label="Nombre"
          required
          minLength={2}
          maxLength={100}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          error={primerError(field.state.meta.errors)}
        />
      )}
    </form.Field>

    <form.Field name="descripcion">
      {(field) => (
        <Textarea
          label="Descripción"
          rows={3}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
        />
      )}
    </form.Field>

    <form.Field name="imagen_url">
      {(field) => (
        <div className="grid gap-2">
          <Input
            label="Ruta o URL de imagen (opcional)"
            placeholder="/images/categories/hamburguesas.png"
            value={field.state.value}
            onChange={(event) => field.handleChange(event.target.value)}
          />
          {field.state.value.trim() && (
            <img
              src={field.state.value}
              alt="Vista previa de categoría"
              className="h-36 w-full rounded-xl border bg-[#f7f4ee] object-contain"
            />
          )}
        </div>
      )}
    </form.Field>

    {error !== null && <EstadoError error={error} />}
    <Button type="submit" disabled={pendiente}>Guardar categoría</Button>
  </form>
}