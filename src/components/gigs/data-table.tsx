"use client";

import * as React from "react";
import Link from "next/link";
// import { products, type Product } from "@/db/schema"
import { type ColumnDef } from "@tanstack/react-table";
// import { toast } from "sonner"
import { toast } from "@/hooks/use-toast";
import { type Gig } from "@prisma/client";

import {
  catchError,
  formatDate,
  formatPrice,
  calculateTimeDifference,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
// import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/shadcn/data-table-column-header";
import { Icons } from "../icons";
// import { deleteProductAction } from "@/app/_actions/product"

interface Props {
  data: Gig[];
  pageCount: number;
}

export default function Datatable({ data, pageCount }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([]);

  // Memoize the columns so they don't re-render on every render
  const columns: ColumnDef<Gig>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="id" />
    //   ),
    //   cell: ({ row }) => <span className="w-[80px]">{row.getValue("id")}</span>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },

    {
      accessorKey: "gigDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return <span>{formatDate(row.original.gigDate)}</span>;
      },
    },
    {
      accessorKey: "timeStart",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Start" />
      ),
      cell: ({ row }) => {
        return (
          <span>{row.original.timeStart?.toLocaleTimeString("en-US")}</span>
        );
      },
    },
    {
      accessorKey: "timeEnd",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="End" />
      ),
      cell: ({ row }) => {
        return <span>{row.original.timeEnd?.toLocaleTimeString("en-US")}</span>;
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Duration" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.timeStart && row.original.timeEnd
              ? calculateTimeDifference(
                  row.original.timeStart,
                  row.original.timeEnd
                )
              : 0}
          </span>
        );
      },
    },
    {
      accessorKey: "santa.nameFirst",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Santa" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.santa.nameFirst} {row.original.santa.nameLast}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ cell }) => formatPrice(cell.getValue() as number),
    },

    // {
    //   id: "actions",
    //   cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
  ];

  // function deleteSelectedRows() {
  //   toast.promise(
  //     Promise.all(
  //       selectedRowIds.map((id) =>
  //         deleteProductAction({
  //           id,
  //           storeId,
  //         })
  //       )
  //     ),
  //     {
  //       loading: "Deleting...",
  //       success: () => {
  //         setSelectedRowIds([])
  //         return "Products deleted successfully."
  //       },
  //       error: (err: unknown) => {
  //         setSelectedRowIds([])
  //         return catchError(err)
  //       },
  //     }
  //   )
  // }

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      // filterableColumns={[
      //   {
      //     id: "gigDate",
      //     title: "Category"
      //     // options: products.category.enumValues.map((category) => ({
      //     //   label: `${category.charAt(0).toUpperCase()}${category.slice(1)}`,
      //     //   value: category,
      //     // })),
      //   },
      // ]}
      searchableColumns={[
        {
          id: "gigDate",
          title: "Gig Date",
        },
        {
          id: "timeStart",
          title: "Start",
        },
      ]}
      // newRowLink={`/dashboard/gigs/new`}
      // deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
