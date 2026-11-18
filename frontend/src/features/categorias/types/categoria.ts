export interface CategoriaDatos {
  nombre: string
  descripcion: string | null
  imagen_url: string | null
}

export interface Categoria extends CategoriaDatos {
  id: number
  activo: boolean
}