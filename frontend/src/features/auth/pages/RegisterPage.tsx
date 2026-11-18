import { useForm } from "@tanstack/react-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, primerError } from "@/shared/ui/Input"
import { AuthCard } from "../components/AuthCard"
import { useRegistro } from "../hooks/useRegistro"

const campos = [
  { name: "username", label: "Usuario", type: "text", auto: "username" },
  { name: "full_name", label: "Nombre y apellido", type: "text", auto: "name" },
  { name: "email", label: "Correo electrónico", type: "email", auto: "email" },
  { name: "password", label: "Contraseña", type: "password", auto: "new-password" },
] as const

export function RegisterPage() {
  const registrar = useRegistro()
  const navigate = useNavigate()
  const location = useLocation()
  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      await registrar.mutateAsync({ ...value, username: value.username.trim(), full_name: value.full_name.trim(), email: value.email.trim() })
      navigate("/login", { replace: true, state: { registrado: true, from: location.state?.from } })
    },
  })
  return <AuthCard title="Creá tu cuenta" text="Registrate para confirmar pedidos y consultar su estado.">
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
      {campos.map(({ name, label, type, auto }) => <form.Field key={name} name={name} validators={{
        onChange: ({ value }) => {
          if (name === "password") {
            if (value.length < 8) return "Usá al menos 8 caracteres"
            if (new TextEncoder().encode(value).length > 72) return "Usá una contraseña más corta"
          } else if (!value.trim()) return "Completá este campo"
        },
      }}>
        {(field) => <Input label={label} required type={type} autoComplete={auto} minLength={name === "password" ? 8 : undefined} value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
      </form.Field>)}
      {registrar.isError && <EstadoError error={registrar.error} />}
      <Button type="submit" disabled={registrar.isPending}>{registrar.isPending ? "Creando cuenta…" : "Crear cuenta"}</Button>
    </form>
    <p className="mt-5 text-sm">¿Ya tenés cuenta? <Link className="font-semibold underline" to="/login" state={location.state}>Ingresá</Link>.</p>
  </AuthCard>
}
