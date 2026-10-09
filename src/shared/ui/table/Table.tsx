import { FlexRender } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useLegacyTable,
  type LegacyColumnDef as ColumnDef,
} from '@tanstack/react-table/legacy';
import type { SortingState } from '@tanstack/table-core';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Skeleton } from '../skeleton/Skeleton';

export type { ColumnDef, SortingState };

export interface DataTableProps<TData extends Record<string, any>> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
  initialSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
}

export function Table<TData extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className,
  initialSorting = [],
  onSortingChange: externalSortingChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  const handleSortingChange = (updater: any) => {
    const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(nextSorting);
    externalSortingChange?.(nextSorting);
  };

  const table = useLegacyTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* Table Header */}
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={cn(
                        'px-4 py-3.5 tracking-wider select-none',
                        canSort && 'cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder ? null : (
                          <FlexRender header={header} />
                        )}

                        {canSort && (
                          <span className="shrink-0 text-slate-400">
                            {isSorted === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
                            ) : isSorted === 'desc' ? (
                              <ArrowDown className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((_, colIndex) => (
                    <td key={`skeleton-cell-${colIndex}`} className="px-4 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row: any) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    'transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3.5 text-slate-700 dark:text-slate-300"
                    >
                      <FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
