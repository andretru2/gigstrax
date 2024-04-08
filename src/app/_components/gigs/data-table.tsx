"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  formatDate,
  formatAddress,
  calculateTimeDifference,
  toTitleCase,
  getTimeFromDate,
} from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

import { Icons } from "../icons";
import { type GigExtendedProps } from "@/types/index";

interface Props {
  data: GigExtendedProps[];
  pageCount: number;
}

export default function Datatable({ data, pageCount }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const classNameTableRow =
    "[&>*:nth-child(1)]:w-48  [&>*:nth-child(6)]:w-32 [&>*:nth-child(5)]:w-32 [&>*:nth-child(7)]:w-40 ";

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<GigExtendedProps, unknown>[]>(
    () => [
      {
        accessorKey: "gigDate",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Date"
            className="   [&>*]:justify-start [&>*]:px-2 "
          />
        ),

        cell: ({ cell }) => (
          <div className="  truncate px-2 text-left">
            {!cell.getValue()
              ? null
              : formatDate(cell.getValue() as Date, "friendly")}
          </div>
        ),
        // cell: ({ row }) => {
        //   return (
        //     <span className="w-96">
        //       {formatDate(row.original.gigDate, "friendly")}
        //     </span>
        //   );
        // },
      },
      {
        accessorKey: "timeStart",
        header: () => <div className=" text-center">Start</div>,
        cell: ({ row }) => {
          return (
            <div className="text-center">
              {row.original.timeStart
                ? getTimeFromDate(row.original.timeStart, true)
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "timeEnd",
        header: () => <div className=" text-center">End</div>,

        cell: ({ row }) => {
          return (
            <div className=" text-center">
              {row.original.timeEnd
                ? getTimeFromDate(row.original.timeEnd, true)
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "duration",
        // header: "Duration",
        header: () => <div className=" text-center">Duration</div>,

        cell: ({ row }) => {
          return (
            <div className=" text-center">
              {row.original.timeStart && row.original.timeEnd
                ? calculateTimeDifference(
                    row.original.timeStart,
                    row.original.timeEnd,
                  )
                : 0}
            </div>
          );
        },
      },
      {
        accessorKey: "santaId",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Santa"
            className="  text-left [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="truncate px-2 text-left">
              {row.original.santa?.role}
            </div>
          );
        },
      },
      {
        accessorKey: "mrsSantaId",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Mrs. Santa"
            className="[&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" truncate px-2 text-left">
              {row.original?.mrsSanta?.nameFirst}
            </div>
          );
        },
      },
      {
        accessorKey: "clientId",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Client"
            className="  [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className=" truncate px-2 text-left">
              {row.original?.client?.client &&
                toTitleCase(row.original?.client?.client)}
            </div>
          );
        },
      },

      {
        accessorKey: "venueAddressName",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Venue"
            className="  [&>*]:justify-start [&>*]:px-2 [&>*]:text-left"
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="   truncate pr-4 text-left">
              {formatAddress({
                name: row.original.venueAddressName ?? "",
                addressLine1: row.original.venueAddressStreet ?? "",
                addressLine2: row.original.venueAddressStreet2 ?? "",
                city: row.original.venueAddressCity ?? "",
                state: row.original.venueAddressState ?? "",
                zip: row.original.venueAddressZip ?? "",
              })}
            </div>
          );
        },
      },
      // {
      //   accessorKey: "createdAt",
      //   header: ({ column }) => (
      //     <DataTableColumnHeader column={column} title="Created At" />
      //   ),
      //   cell: ({ cell }) => cell.getValue(),
      //   enableColumnFilter: false,
      // },
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
                {row.original.id && (
                  <Link href={`/dashboard/gigs/${row.original.id}`}>Edit</Link>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  startTransition(() => {
                    console.log("deleted");
                  });
                  // row.toggleSelected(false)
                  // toast.promise(
                  //   deleteProductAction({
                  //     id: row.original.id,
                  //     storeId,
                  //   }),
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
    [isPending],
  );

  // },
  // {
  //   accessorKey: "price",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Price" />
  //   ),
  //   cell: ({ cell }) => (
  //     <span className="text-right">
  //       {!cell.getValue() ? 0 : formatPrice(cell.getValue() as number)}
  //     </span>
  //   ),
  // },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },

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
      onRowClick={(e, row) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const id = row.original.id as number;
        id && router.push(`/dashboard/gigs/${id}`);
      }}
      pageCount={pageCount}
      classNameTableRow={classNameTableRow}
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
          id: "clientId",
          title: "Client",
        },
        {
          id: "santaId",
          title: "Santa",
        },
        // {
        //   id: "gigDate",
        //   title: "Gig Date",
        // },
      ]}
      // newRowLink={`/dashboard/gigs/new`}
      // deleteRowsAction={() => void deleteSelectedRows()}
    />
  );
}
