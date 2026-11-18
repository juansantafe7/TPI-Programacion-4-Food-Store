import { handleApiError } from "../api/handleApiError"
import { Button } from "../ui/Button"

export function Skeleton() {
  return <div role="status" aria-label="Cargando" className="grid gap-4 sm:grid-cols-3">
    {[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-[#eae5d9] motion-reduce:animate-none" />)}
  </div>
}

export function EstadoVacio({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-[#cfc8b6] bg-white p-8 text-center text-[#5a5746]">{text}</p>
}

export function EstadoError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return <div role="alert" className="rounded-xl border border-[#efd4ca] bg-[#fbede8] p-3 text-sm text-[#862d21]">
    {handleApiError(error)}
    {onRetry && <Button variant="secondary" className="ml-3" onClick={onRetry}>Reintentar</Button>}
  </div>
}
