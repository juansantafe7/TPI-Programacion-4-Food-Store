import type { ReactNode } from "react"
import { Card } from "@/shared/ui/Card"

export function AuthCard({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return <div className="mx-auto max-w-md">
    <Card className="sm:p-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-6 mt-2 text-sm text-[#5d5947]">{text}</p>
      {children}
    </Card>
  </div>
}
