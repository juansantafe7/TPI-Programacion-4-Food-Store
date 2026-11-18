import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Skeleton } from "@/shared/components/Estados"
import { useAuthStore } from "@/store/authStore"

export function ProtectedRoute({ rol }: { rol?: "admin" }) {
  const usuario = useAuthStore((state) => state.usuario)
  const cargando = useAuthStore((state) => state.cargando)
  const location = useLocation()
  if (cargando) return <Skeleton />
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (rol && usuario.role !== rol) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
