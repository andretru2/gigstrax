"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";

import { formatAddress, formatPhone } from "@/lib/utils";
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

import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { Icons } from "../icons";
import { type SourceProps } from "@/server/db";
// import { deleteProductAction } from "@/app/_actions/product"

interface Props {
  data: SourceProps[];
  pageCount: number;
}

export default function Datatable({ data, pageCount }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([]);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<SourceProps, unknown>[]>(
    () => [
      {
        accessorKey: "nameFirst",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
        cell: ({ row }) => {
          return <span className="w-96">{row.original.nameFirst}</span>;
        },
      },
      {
        accessorKey: "nameLast",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) => {
          return <span>{row.original.nameLast}</span>;
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
          return <span>{row.original.role}</span>;
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => {
          return (
            <span>
              {" "}
              {row.original.phone && formatPhone(row.original.phone)}
            </span>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => {
          return <span className="">{row.original.email}</span>;
        },
      },

      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          return <span>{row.original.status}</span>;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <Icons.moreHorizontal className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/sources/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // startTransition(() => {
                  //   row.toggleSelected(false)
                  //   toast.promise(
                  //     deleteProductAction({
                  //       id: row.original.id,
                  //       storeId,
                  //     }),
                  //     {
                  //       loading: "Deleting...",
                  //       success: () => "Product deleted successfully.",
                  //       error: (err: unknown) => catchError(err),
                  //     }
                  //   )
                  // })
                }}
                disabled={isPending}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [isPending]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      onRowClick={(row) => {
        console.log(row);
      }}
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
          id: "nameFirst",
          title: "First Name",
        },
        {
          id: "nameLast",
          title: "Last Name",
        },
      ]}
      // newRowLink={`/dashboard/gigs/new`}
      // deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
