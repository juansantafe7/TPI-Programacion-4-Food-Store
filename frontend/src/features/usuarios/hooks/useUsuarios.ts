import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cambiarEstadoUsuario, listarUsuarios } from "../api/usuarios"

export const useUsuarios = () => useQuery({ queryKey: ["usuarios"], queryFn: listarUsuarios })

export function useCambiarEstadoUsuario() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activar }: { id: number; activar: boolean }) => cambiarEstadoUsuario(id, activar),
    onSuccess: () => client.invalidateQueries({ queryKey: ["usuarios"] }),
  })
}
