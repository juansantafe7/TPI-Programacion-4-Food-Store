import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export function MainLayout() {
  return <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:py-12"><Outlet /></main>
    <footer className="border-t border-[#e6e0d1] px-5 py-5 text-center text-xs text-[#625c49]">Food Store · Programación 4</footer>
  </div>
}

const menu = [
  ["/admin/resumen", "Resumen"], ["/admin/categorias", "Categorías"], ["/admin/productos", "Productos"],
  ["/admin/pedidos", "Pedidos"], ["/admin/usuarios", "Usuarios"],
] as const

export function AdminLayout() {
  return <>
    <nav aria-label="Administración" className="mb-7 flex flex-wrap gap-1.5 border-b border-[#e6e0d1] pb-3">
      {menu.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-[#43532c] text-white" : "text-[#4f5638] hover:bg-[#ebeddf]"}`
      }>{label}</NavLink>)}
    </nav>
    <Outlet />
  </>
}
