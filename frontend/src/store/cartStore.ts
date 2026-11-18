import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Producto } from "@/features/productos/types/producto"

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (producto: Producto) => boolean
  quitar: (id: number) => void
  cambiarCantidad: (id: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      agregar: (producto) => {
        const items = get().items
        const existe = items.find((item) => item.producto_id === producto.id)
        if (!producto.disponible || (existe?.cantidad ?? 0) >= producto.stock) return false
        if (existe) {
          set({ items: items.map((item) => item.producto_id === producto.id
            ? { ...item, cantidad: item.cantidad + 1, nombre: producto.nombre, precio_unitario: producto.precio_base }
            : item) })
        } else {
          set({ items: [...items, { producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base, cantidad: 1 }] })
        }
        return true
      },
      quitar: (id) => set(({ items }) => ({ items: items.filter((item) => item.producto_id !== id) })),
      cambiarCantidad: (id, cantidad) => {
        if (!Number.isSafeInteger(cantidad) || cantidad < 1) return
        set(({ items }) => ({ items: items.map((item) => item.producto_id === id ? { ...item, cantidad } : item) }))
      },
      vaciar: () => set({ items: [] }),
      total: () => get().items.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0),
    }),
    { name: "foodstore-carrito", partialize: ({ items }) => ({ items }) },
  ),
)
