import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cerrarSesion, iniciarSesion, perfil } from "@/features/auth/api/auth"
import type { Usuario } from "@/features/usuarios/types/usuario"
import { configurarSesion } from "@/shared/api/axiosInstance"
import { queryClient } from "@/shared/api/queryClient"

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  login: (username: string, password: string) => Promise<Usuario>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiar: () => void
}

const limpiarConsultasPrivadas = () => {
  for (const clave of ["pedidos", "usuarios"]) queryClient.removeQueries({ queryKey: [clave] })
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      cargando: true,
      login: async (username, password) => {
        await iniciarSesion(username, password)
        const usuario = await perfil()
        limpiarConsultasPrivadas()
        set({ usuario, cargando: false })
        return usuario
      },
      logout: async () => {
        await cerrarSesion()
        get().limpiar()
      },
      checkSession: async () => {
        try {
          set({ usuario: await perfil() })
        } catch {
          get().limpiar()
        } finally {
          set({ cargando: false })
        }
      },
      limpiar: () => {
        set({ usuario: null, cargando: false })
        limpiarConsultasPrivadas()
      },
    }),
    { name: "foodstore-sesion", partialize: ({ usuario }) => ({ usuario }) },
  ),
)

configurarSesion(() => useAuthStore.getState().limpiar())
