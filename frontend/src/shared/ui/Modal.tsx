import { useId, useLayoutEffect, useRef, type ReactNode } from "react"

export function Modal({ title, children, onClose, ocupado = false }: {
  title: string; children: ReactNode; onClose: () => void; ocupado?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useLayoutEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])
  return <dialog ref={ref} aria-labelledby={id} onCancel={(event) => {
    event.preventDefault()
    if (!ocupado) onClose()
  }} className="m-auto max-h-[90dvh] w-[min(92vw,38rem)] rounded-2xl border border-[#e6e0d1] bg-white p-5 text-[#27261a] shadow-xl backdrop:bg-black/45 sm:p-7">
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 id={id} className="text-xl font-bold">{title}</h2>
      <button type="button" aria-label="Cerrar" disabled={ocupado} onClick={onClose} className="btn-secondary">×</button>
    </div>
    {children}
  </dialog>
}
