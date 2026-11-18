import { Link } from "react-router-dom"
import { Encabezado } from "@/shared/components/Encabezado"
import { buttonLink } from "@/shared/ui/Button"

export function UnauthorizedPage() {
  return <>
    <Encabezado titulo="Acceso restringido" descripcion="Tu cuenta no tiene permiso para abrir esta página." />
    <Link className={buttonLink} to="/">Volver al catálogo</Link>
  </>
}
