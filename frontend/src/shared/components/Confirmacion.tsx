import { Button } from "../ui/Button"
import { Modal } from "../ui/Modal"
import { EstadoError } from "./Estados"

export function Confirmacion({ titulo, texto, confirmar, cerrar, pendiente, error, accion = "Confirmar" }: {
  titulo: string; texto: string; confirmar: () => void; cerrar: () => void; pendiente: boolean; error: unknown; accion?: string
}) {
  return <Modal title={titulo} onClose={cerrar} ocupado={pendiente}>
    <p className="mb-4 text-sm text-[#5d5947]">{texto}</p>
    {error !== null && <EstadoError error={error} />}
    <div className="mt-4 flex justify-end gap-2">
      <Button variant="secondary" disabled={pendiente} onClick={cerrar}>Volver</Button>
      <Button variant="danger" disabled={pendiente} onClick={confirmar}>{accion}</Button>
    </div>
  </Modal>
}
