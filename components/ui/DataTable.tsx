"use client";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

export type DataTableSortDirection =
 | "asc"
 | "desc";

export interface DataTableColumn<T> {
  readonly id: string;
  readonly header: ReactNode;
  readonly accessor: (
    row: T
  ) => ReactNode;
  readonly sortable?: boolean;
  readonly align?: "left" | "center" | "right";
  readonly width?: string;
}

interface DataTableProps<T> {
  readonly columns: readonly DataTableColumn<T>[];
  readonly rows: readonly T[];
  readonly getRowId: (row: T) => string;
  readonly sortColumn?: string;
  readonly sortDirection?: DataTableSortDirection;
  readonly onSort?: (
    columnId: string,
    direction: DataTableSortDirection
  ) => void;

    readonly emptyState?: ReactNode;
    readonly className?: string;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function DataTable<T>({
  className,
  columns,
  emptyState,
  getRowId,
  onSort,
  rows,
  sortColumn,
  sortDirection = "asc",
}: DataTableProps<T>): React.JSX.Element {
  const handleSort = (
    columnId: string
  ): void => {
    if (!onSort) {
      return;
    }

     const nextDirection =
      sortColumn === columnId &&
      sortDirection === "asc"
       ? "desc"
       : "asc";

      onSort(
        columnId,
        nextDirection
      );
    };

    return (
     <div
       className={cn(
        "overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-card)]",
        className

   )}
  >
   <div className="overflow-x-auto">
     <table className="w-full border-collapse">
      <thead className="bg-[color:rgb(200_169_106_/_0.08)]">
       <tr>
        {columns.map((column) => {
          const alignment =
           column.align ?? "left";

          const active =
           sortColumn === column.id;

           return (
            <th
              key={column.id}
              scope="col"
              style={{
                width: column.width,
              }}
              className={cn(
                "border-b border-border px-5 py-4 text-xs font-semibold uppercasetracking-[0.15em] text-muted",
                alignmentClasses[alignment]
              )}
            >
              {column.sortable ? (
                <button
                 type="button"
                 onClick={() =>
                   handleSort(column.id)
                 }
                 className={cn(
                   "inline-flex items-center gap-2 outline-none hover:text-foreground",
                   alignment === "right" &&
                     "flex-row-reverse"
                 )}
                >
                 {column.header}

               {active ? (
                sortDirection === "asc" ? (
                 <ChevronUp
                   aria-hidden="true"

                className="size-3.5"
               />
             ):(
               <ChevronDown
                aria-hidden="true"
                className="size-3.5"
               />
             )
           ) : null}
          </button>
        ):(
          column.header
        )}
       </th>
     );
   })}
 </tr>
</thead>

<tbody className="divide-y divide-border">
 {rows.length > 0 ? (
   rows.map((row) => (
     <tr
      key={getRowId(row)}
      className="transition-colors hover:bg-[color:rgb(200_169_106_/_0.045)]"
     >
      {columns.map((column) => (
        <td
          key={column.id}
          className={cn(
            "px-5 py-4 text-sm text-foreground",
            alignmentClasses[
              column.align ?? "left"
            ]
          )}
        >
          {column.accessor(row)}
        </td>
      ))}
     </tr>
   ))
 ):(
   <tr>
     <td

             colSpan={columns.length}
             className="px-6 py-16 text-center text-muted"
           >
             {emptyState ??
              "No records found."}
           </td>
          </tr>
        )}
       </tbody>
     </table>
    </div>
   </div>
 );
}
