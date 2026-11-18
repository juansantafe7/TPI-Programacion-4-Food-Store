import type { Categoria } from "@/features/categorias/types/categoria"

export interface ProductoDatos {
  categoria_id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
}

export interface Producto extends ProductoDatos {
  id: number
  activo: boolean
  categoria: Categoria
}

export interface FiltrosProductos {
  skip?: number
  limit?: number
  search?: string
  categoria_id?: number
  disponible?: boolean
}

export interface ProductosPaginados {
  total: number
  items: Producto[]
}
