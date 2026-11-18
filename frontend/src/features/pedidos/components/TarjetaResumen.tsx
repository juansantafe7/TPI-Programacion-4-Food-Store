import { Card } from "@/shared/ui/Card"

export function TarjetaResumen({ titulo, valor }: { titulo: string; valor: string | number }) {
  return <Card><h2 className="text-sm font-medium text-[#5d5947]">{titulo}</h2><p className="mt-2 text-3xl font-bold tracking-tight">{valor}</p></Card>
}
