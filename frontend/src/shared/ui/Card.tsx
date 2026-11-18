import type { ReactNode } from "react"

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#e6e0d1] bg-white p-5 shadow-sm ${className}`}>{children}</div>
}
