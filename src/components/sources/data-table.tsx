"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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
import { SourceStatus } from "@prisma/client";

// import { deleteProductAction } from "@/app/_actions/product"

interface Props {
  data: SourceProps[];
  pageCount: number;
}

export default function Datatable({ data, pageCount }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([]);
  const router = useRouter();

  const classNameTableRow =
    "[&>*:nth-child(1)]:w-28 [&>*:nth-child(2)]:w-28  [&>*:nth-child(3)]:w-28  [&>*:nth-child(4)]:w-32  [&>*:nth-child(5)]:w-40 [&>*:nth-child(6)]:w-32";

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<SourceProps, unknown>[]>(
    () => [
      {
        accessorKey: "nameFirst",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="First Name"
            className=" [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" w-28 truncate px-2 text-left">
              {row.original.nameFirst}
            </div>
          );
        },
      },
      {
        accessorKey: "nameLast",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Last Name"
            className="   [&>*]:justify-start [&>*]:px-2 [&>*]:text-left "
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" truncate  px-2 text-left ">
              {row.original.nameLast}
            </div>
          );
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Role"
            className=" [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" w-28 truncate  px-2 text-left">
              {row.original.role}
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" className=" " />
        ),
        cell: ({ row }) => {
          return (
            <div className=" w-32 truncate ">
              {row.original.phone && formatPhone(row.original.phone)}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Email"
            className=" [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" w-40 px-2 text-left">{row.original.email}</div>
          );
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
      onRowClick={(e, row) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const id = row.original.id as number;

        id && router.push(`/dashboard/sources/${id}`);
      }}
      classNameTableRow={classNameTableRow}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: Object.values(SourceStatus).map((status) => ({
            // label: `${status.charAt(0)}${status.slice(1)}`,
            label: status,
            value: status,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "nameFirst",
          title: "First Name",
        },
        {
          id: "nameLast",
          title: "Last Name",
        },
        // {
        //   id: "status",
        //   title: "Status",
        // },
      ]}
      // newRowLink={`/dashboard/gigs/new`}
      // deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
