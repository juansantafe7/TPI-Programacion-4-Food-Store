import { isAxiosError } from "axios"

export function handleApiError(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return "No se pudo conectar con Food Store. Revisá la conexión e intentá de nuevo."
    const detail: unknown = error.response.data?.detail
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) {
      const errores = detail.map((item: unknown) => {
        if (!item || typeof item !== "object" || !("msg" in item) || typeof item.msg !== "string") return ""
        const campo = "loc" in item && Array.isArray(item.loc) ? item.loc.slice(1).join(".") : ""
        return campo ? `${campo} · ${item.msg}` : item.msg
      }).filter(Boolean)
      if (errores.length) return errores.join(" ")
    }
  }
  return "No se pudo completar la operación. Volvé a intentarlo."
}
