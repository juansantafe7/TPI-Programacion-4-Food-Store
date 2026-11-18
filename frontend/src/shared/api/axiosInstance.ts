import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
})

export function configurarSesion(limpiar: () => void) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const ruta = error.config?.url
        const status = error.response?.status
        const detail: unknown = error.response?.data?.detail
        if (
          (status === 401 && ruta !== "/auth/token" && ruta !== "/auth/me")
          || (status === 400 && detail === "Cuenta de usuario desactivada")
        ) limpiar()
      }
      return Promise.reject(error)
    },
  )
}
