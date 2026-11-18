import type { ColumnDef } from "@tanstack/react-table"
import { Encabezado } from "@/shared/components/Encabezado"
import { EstadoError, Skeleton } from "@/shared/components/Estados"
import { TablaAdmin } from "@/shared/components/TablaAdmin"
import { Button } from "@/shared/ui/Button"
import { useAuthStore } from "@/store/authStore"
import { useCambiarEstadoUsuario, useUsuarios } from "../hooks/useUsuarios"
import type { Usuario } from "../types/usuario"

export function AdminUsuariosPage() {
  const usuarioId = useAuthStore((state) => state.usuario?.id)
  const query = useUsuarios()
  const cambiar = useCambiarEstadoUsuario()
  const columnas: ColumnDef<Usuario>[] = [
    { accessorKey: "username", header: "Usuario" },
    { accessorKey: "full_name", header: "Nombre" },
    { accessorKey: "email", header: "Correo" },
    { accessorKey: "role", header: "Rol" },
    { accessorKey: "disabled", header: "Estado", cell: ({ row }) => row.original.disabled ? "Desactivado" : "Activo" },
    { id: "acciones", header: "Acciones", cell: ({ row }) => {
      const usuario = row.original
      return usuario.id !== usuarioId && <Button variant={usuario.disabled ? "secondary" : "danger"} disabled={cambiar.isPending} onClick={() =>
        cambiar.mutate({ id: usuario.id, activar: usuario.disabled })
      }>{usuario.disabled ? "Activar" : "Desactivar"}</Button>
    } },
  ]
  return <>
    <Encabezado titulo="Usuarios" />
    {query.isPending && <Skeleton />}
    {query.isError && <EstadoError error={query.error} onRetry={() => void query.refetch()} />}
    {cambiar.isError && <div className="mb-3"><EstadoError error={cambiar.error} /></div>}
    {query.data && <TablaAdmin rows={query.data} columns={columnas} empty="No hay usuarios registrados." />}
  </>
}
