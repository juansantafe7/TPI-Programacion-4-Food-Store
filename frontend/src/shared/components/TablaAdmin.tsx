import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./DataTable"
import { EstadoVacio } from "./Estados"

export function TablaAdmin<T>({ rows, columns, empty }: { rows: T[]; columns: ColumnDef<T>[]; empty: string }) {
  const table = useReactTable({
    data: rows, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  })
  return rows.length ? <DataTable table={table} /> : <EstadoVacio text={empty} />
}
