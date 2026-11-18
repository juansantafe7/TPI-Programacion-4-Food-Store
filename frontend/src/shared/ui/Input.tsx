import { useId, type ComponentProps } from "react"

type FieldProps = { label: string; error?: string }

export function Input({ label, error, ...props }: ComponentProps<"input"> & FieldProps) {
  const id = useId()
  return <label className="label" htmlFor={id}>{label}
    <input {...props} id={id} className="field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <span id={`${id}-error`} className="text-xs text-red-800">{error}</span>}
  </label>
}

export function Select({ label, error, ...props }: ComponentProps<"select"> & FieldProps) {
  const id = useId()
  return <label className="label" htmlFor={id}>{label}
    <select {...props} id={id} className="field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <span id={`${id}-error`} className="text-xs text-red-800">{error}</span>}
  </label>
}

export function Textarea({ label, error, ...props }: ComponentProps<"textarea"> & FieldProps) {
  const id = useId()
  return <label className="label" htmlFor={id}>{label}
    <textarea {...props} id={id} className="field resize-y" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <span id={`${id}-error`} className="text-xs text-red-800">{error}</span>}
  </label>
}

export const primerError = (errors: unknown[]) => errors.find((error): error is string => typeof error === "string")
