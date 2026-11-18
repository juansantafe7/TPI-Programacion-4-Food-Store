import { flexRender, type Table } from "@tanstack/react-table"

type DataTableProps<T> = {
  table: Table<T>
}

export const DataTable = <T,>({ table }: DataTableProps<T>) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300"
                >
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className={header.column.getCanSort() ? "flex items-center gap-2 hover:text-slate-900 dark:hover:text-white" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc"
                        ? "↑"
                        : header.column.getIsSorted() === "desc"
                          ? "↓"
                          : null}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Página {table.getState().pagination.pageIndex + 1} de {Math.max(table.getPageCount(), 1)}
      </span>
      <div className="flex gap-2">
        <button type="button" className="btn-secondary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </button>
        <button type="button" className="btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Siguiente
        </button>
      </div>
    </div>
  </div>
)
