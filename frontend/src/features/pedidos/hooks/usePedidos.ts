import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cambiarEstadoPedido, cancelarPedido, crearPedido, detallePedido, listarPedidos, resumenPedidos, type FiltrosPedidos } from "../api/pedidos"
import type { EstadoPedido } from "../types/pedido"

export const usePedidos = (filtros: FiltrosPedidos, usuarioId: number | undefined) =>
  useQuery({ queryKey: ["pedidos", "listado", usuarioId, filtros], queryFn: () => listarPedidos(filtros) })

export const useMisPedidos = (filtros: FiltrosPedidos, usuarioId: number | undefined, admin: boolean) =>
  useQuery({
    queryKey: ["pedidos", "propios", usuarioId, filtros],
    queryFn: async () => {
      if (!admin) return listarPedidos(filtros)
      const propios = []
      for (let skip = 0; ; skip += 100) {
        const pagina = await listarPedidos({ skip, limit: 100 })
        propios.push(...pagina.items.filter((pedido) => pedido.usuario_id === usuarioId))
        if (skip + pagina.items.length >= pagina.total || pagina.items.length === 0) break
      }
      return { total: propios.length, items: propios.slice(filtros.skip, filtros.skip + filtros.limit) }
    },
  })

export const useDetallePedido = (id: number, usuarioId: number | undefined) =>
  useQuery({ queryKey: ["pedidos", "detalle", usuarioId, id], queryFn: () => detallePedido(id) })

export const useResumenPedidos = () => useQuery({ queryKey: ["pedidos", "resumen"], queryFn: resumenPedidos })

function useRefrescarPedidos() {
  const client = useQueryClient()
  return () => Promise.all([
    client.invalidateQueries({ queryKey: ["pedidos"] }),
    client.invalidateQueries({ queryKey: ["productos"] }),
  ])
}

export const useCrearPedido = () => useMutation({ mutationFn: crearPedido, onSuccess: useRefrescarPedidos() })
export const useCancelarPedido = () => useMutation({ mutationFn: cancelarPedido, onSuccess: useRefrescarPedidos() })

export const useCambiarEstadoPedido = () => useMutation({
  mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, estado),
  onSuccess: useRefrescarPedidos(),
})
