import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { actualizarCategoria, anularCategoria, crearCategoria, listarCategorias } from "../api/categorias"
import type { CategoriaDatos } from "../types/categoria"

export const useCategorias = () => useQuery({ queryKey: ["categorias"], queryFn: listarCategorias })

export function useMutacionesCategorias() {
  const client = useQueryClient()
  const refrescar = () => Promise.all([
    client.invalidateQueries({ queryKey: ["categorias"] }),
    client.invalidateQueries({ queryKey: ["productos"] }),
  ])
  const guardar = useMutation({
    mutationFn: ({ id, data }: { id?: number; data: CategoriaDatos }) =>
      id === undefined ? crearCategoria(data) : actualizarCategoria(id, data),
    onSuccess: refrescar,
  })
  const anular = useMutation({ mutationFn: anularCategoria, onSuccess: refrescar })
  return { guardar, anular }
}
