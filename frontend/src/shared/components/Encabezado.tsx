import type { ReactNode } from "react"

export function Encabezado({ titulo, descripcion, accion }: { titulo: string; descripcion?: string; accion?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{titulo}</h1>
      {descripcion && <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5d5947]">{descripcion}</p>}
    </div>
    {accion}
  </div>
}
