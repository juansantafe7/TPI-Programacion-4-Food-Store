import { Button } from "../ui/Button"

export function Paginacion({ pagina, total, limite, cambiar }: {
  pagina: number; total: number; limite: number; cambiar: (page: number) => void
}) {
  const paginas = Math.max(1, Math.ceil(total / limite))
  if (paginas === 1 && pagina === 0) return null
  return <nav aria-label="Paginación" className="mt-6 flex flex-wrap items-center justify-between gap-3">
    <span className="text-sm text-[#615d4a]">Página {pagina + 1} de {paginas}</span>
    <div className="flex gap-2">
      <Button variant="secondary" disabled={pagina === 0} onClick={() => cambiar(pagina - 1)}>Anterior</Button>
      <Button variant="secondary" disabled={pagina + 1 >= paginas} onClick={() => cambiar(pagina + 1)}>Siguiente</Button>
    </div>
  </nav>
}
