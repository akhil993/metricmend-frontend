"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Download, Eye, Send, Table2 } from "lucide-react";
import type { MiraDrilldownPayload } from "@/components/mira/visuals/miraDrilldownUtils";
import {
  copyText,
  downloadCsv,
  formatCellValue,
  getTableColumns,
  getTableRows,
  prettifyColumn,
  rowsToCsv,
  sortRows,
} from "@/components/mira/visuals/miraTableUtils";

type Props = {
  visual: any;
  onDrilldown?: (payload: MiraDrilldownPayload) => void;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function MiraTableVisual({ visual, onDrilldown }: Props) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const tableRows = useMemo(() => getTableRows(visual), [visual]);
  const columns = useMemo(() => getTableColumns(visual, tableRows), [visual, tableRows]);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return tableRows;
    return sortRows(tableRows, sortColumn, sortDirection);
  }, [tableRows, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const visibleRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(column: string) {
    setPage(1);
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortColumn(column);
    setSortDirection("asc");
  }

  function handleDrilldown(row: any) {
    const dimension = visual?.dimension || columns[0];
    const value =
      row?.[dimension] ??
      row?.state ??
      row?.city ??
      row?.customer_id ??
      row?.customer ??
      row?.name ??
      row?.[columns[0]];

    onDrilldown?.({
      dimension,
      value,
      row,
      visual,
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Table2 className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              {visual?.title || "Results"}
            </p>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {sortedRows.length} rows · {columns.length} columns
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => copyText(rowsToCsv(visibleRows, columns))} className="rounded-xl border px-3 py-2 text-xs dark:border-white/10">
            <Copy className="mr-1 inline h-3.5 w-3.5" /> Copy view
          </button>
          <button onClick={() => downloadCsv("mira-current-view.csv", rowsToCsv(visibleRows, columns))} className="rounded-xl border px-3 py-2 text-xs dark:border-white/10">
            <Download className="mr-1 inline h-3.5 w-3.5" /> Export view
          </button>
          <button onClick={() => downloadCsv("mira-results.csv", rowsToCsv(sortedRows, columns))} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
            <Download className="mr-1 inline h-3.5 w-3.5" /> Export all
          </button>
        </div>
      </div>

      <div className="max-h-[460px] overflow-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black/10">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-white/10">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Actions</th>
              {columns.map((column: string) => (
                <th key={column} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  <button onClick={() => handleSort(column)} className="inline-flex items-center gap-1">
                    {prettifyColumn(column)}
                    {sortColumn === column &&
                      (sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {visibleRows.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => copyText(JSON.stringify(row, null, 2))} className="rounded-lg border px-2 py-1 text-xs dark:border-white/10">
                      <Eye className="mr-1 inline h-3.5 w-3.5" /> Copy
                    </button>
                    <button onClick={() => handleDrilldown(row)} className="rounded-lg border border-indigo-200 px-2 py-1 text-xs text-indigo-600 dark:border-indigo-400/30 dark:text-indigo-300">
                      <Send className="mr-1 inline h-3.5 w-3.5" /> Drill
                    </button>
                  </div>
                </td>

                {columns.map((column: string) => (
                  <td key={`${index}-${column}`} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {formatCellValue(row?.[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
          className="rounded-lg border px-2 py-1 dark:border-white/10 dark:bg-white/5"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border px-3 py-2 disabled:opacity-40 dark:border-white/10">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-lg border px-3 py-2 disabled:opacity-40 dark:border-white/10">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}