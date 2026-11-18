import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { EstadoError } from "../components/Estados"
import { Button } from "../ui/Button"

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-2.5 py-1.5 text-sm font-medium ${isActive ? "bg-[#eeeee2] text-[#344523]" : "text-[#514d3e] hover:bg-[#f5f2e9]"}`

export function Navbar() {
  const usuario = useAuthStore((state) => state.usuario)
  const cargando = useAuthStore((state) => state.cargando)
  const logout = useAuthStore((state) => state.logout)
  const cantidad = useCartStore((state) => state.items.reduce((sum, item) => sum + item.cantidad, 0))
  const [saliendo, setSaliendo] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const navigate = useNavigate()
  const salir = async () => {
    setSaliendo(true)
    setError(null)
    try {
      await logout()
      navigate("/login", { replace: true })
    } catch (cause) {
      setError(cause)
    } finally {
      setSaliendo(false)
    }
  }
  return <header className="border-b border-[#e6e0d1] bg-[#fffdf9]">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-4">
      <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
        <span>Food Store</span>
      </Link>
      <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-1">
        <NavLink className={navClass} to="/" end>Catálogo</NavLink>
        <NavLink className={navClass} to="/carrito">Carrito ({cantidad})</NavLink>
        {usuario && !cargando && <NavLink className={navClass} to="/mis-pedidos">Mis pedidos</NavLink>}
        {usuario?.role === "admin" && !cargando && <NavLink className={navClass} to="/admin/resumen">Administración</NavLink>}
      </nav>
      <div className="flex flex-wrap items-center gap-2">
        {!cargando && (usuario ? <>
          <span className="text-xs text-[#625c49]">{usuario.full_name} · {usuario.role}</span>
          <Button variant="secondary" disabled={saliendo} onClick={() => void salir()}>Cerrar sesión</Button>
        </> : <><NavLink className={navClass} to="/login">Ingresar</NavLink><NavLink className={navClass} to="/register">Registrarme</NavLink></>)}
      </div>
      {error !== null && <EstadoError error={error} />}
    </div>
  </header>
}
