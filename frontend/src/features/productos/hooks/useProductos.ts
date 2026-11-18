import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { actualizarProducto, actualizarStock, anularProducto, crearProducto, listarProductos } from "../api/productos"
import type { FiltrosProductos, ProductoDatos } from "../types/producto"

export const useProductos = (filtros: FiltrosProductos) =>
  useQuery({ queryKey: ["productos", filtros], queryFn: () => listarProductos(filtros) })

export function useMutacionesProductos() {
  const client = useQueryClient()
  const refrescar = () => client.invalidateQueries({ queryKey: ["productos"] })
  const guardar = useMutation({
    mutationFn: ({ id, data, categoriaCambiada }: { id?: number; data: ProductoDatos; categoriaCambiada: boolean }) => {
      if (id === undefined) return crearProducto(data)
      const { categoria_id, nombre, descripcion, precio_base, imagen_url } = data
      const campos = { nombre, descripcion, precio_base, imagen_url }
      return actualizarProducto(id, categoriaCambiada ? { categoria_id, ...campos } : campos)
    },
    onSuccess: refrescar,
  })
  const stock = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Pick<ProductoDatos, "stock" | "disponible"> }) => actualizarStock(id, data),
    onSuccess: refrescar,
  })
  const anular = useMutation({ mutationFn: anularProducto, onSuccess: refrescar })
  return { guardar, stock, anular }
}
