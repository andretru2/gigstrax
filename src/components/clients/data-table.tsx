"use client";

import * as React from "react";
import Link from "next/link";
// import { products, type Product } from "@/db/schema"
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
import { type ClientProps } from "@/server/db";
// import { deleteProductAction } from "@/app/_actions/product"

interface Props {
  data: ClientProps[];
  pageCount: number;
}

export default function Datatable({ data, pageCount }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([]);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<ClientProps, unknown>[]>(
    () => [
      {
        accessorKey: "client",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Client" />
        ),
        cell: ({ row }) => {
          return <span className="w-96">{row.original.client}</span>;
        },
      },
      {
        accessorKey: "contact",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => {
          return <span>{row.original.contact}</span>;
        },
      },
      {
        accessorKey: "phoneCell",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Cell Phone" />
        ),
        cell: ({ row }) => {
          return (
            <span>
              {row.original.phoneCell && formatPhone(row.original.phoneCell)}
            </span>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Email"
            className="text-center"
          />
        ),
        cell: ({ row }) => {
          return <span className="">{row.original.email}</span>;
        },
      },

      {
        accessorKey: "addressStreet",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
        cell: ({ row }) => {
          return (
            <span>
              {formatAddress({
                addressLine1: row.original.addressStreet ?? "",
                city: row.original.addressCity ?? "",
                state: row.original.addressState ?? "",
                zip: row.original.addressZip ?? "",
              })}
            </span>
          );
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
                <Link href={`/dashboard/clients/${row.original.id}`}>Edit</Link>
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
          id: "client",
          title: "Client",
        },
        {
          id: "phoneCell",
          title: "Phone Cell",
        },
      ]}
      // newRowLink={`/dashboard/gigs/new`}
      // deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
