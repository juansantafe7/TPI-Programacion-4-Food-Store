import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { EstadoError } from "@/shared/components/Estados"
import { Button } from "@/shared/ui/Button"
import { Input, primerError } from "@/shared/ui/Input"
import { useAuthStore } from "@/store/authStore"
import { AuthCard } from "../components/AuthCard"

export function LoginPage() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const location = useLocation()
  const origin: unknown = location.state?.from
  const mutation = useMutation({ mutationFn: ({ username, password }: { username: string; password: string }) => login(username.trim(), password) })
  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
      const next = origin === "/checkout" || origin === "/mis-pedidos" || (typeof origin === "string" && origin.startsWith("/admin/")) ? origin : "/"
      navigate(next, { replace: true })
    },
  })
  return <AuthCard title="Ingresá a Food Store" text="Usá tu nombre de usuario para iniciar sesión.">
    {location.state?.registrado && <p role="status" className="mb-4 rounded-lg bg-[#edf0e0] p-3 text-sm">Cuenta creada. Ya podés ingresar.</p>}
    <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); void form.handleSubmit().catch(() => undefined) }}>
      <form.Field name="username" validators={{ onChange: ({ value }) => value.trim() ? undefined : "Ingresá tu usuario" }}>
        {(field) => <Input label="Usuario" autoComplete="username" required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} error={primerError(field.state.meta.errors)} />}
      </form.Field>
      <form.Field name="password">
        {(field) => <Input label="Contraseña" type="password" autoComplete="current-password" required value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />}
      </form.Field>
      {mutation.isError && <EstadoError error={mutation.error} />}
      <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Ingresando…" : "Ingresar"}</Button>
    </form>
    <p className="mt-5 text-sm">¿Primera vez? <Link className="font-semibold underline" to="/register" state={{ from: origin }}>Creá tu cuenta</Link>.</p>
  </AuthCard>
}
