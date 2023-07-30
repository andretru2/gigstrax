"use client"

import { type ColumnDef } from "@tanstack/react-table"

// import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// import { labels, priorities, statuses } from "../data/data"

import type { Gig } from "@prisma/client"

import { DataTableColumnHeader } from "@/components/data-table/shadcn/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { formatDate, calculateTimeDifference } from "@/lib/utils"

export const columns: ColumnDef<Gig>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => <span className="w-[80px]">{row.getValue("id")}</span>,
    enableSorting: false,
    enableHiding: true,    
    
  },
  {
    accessorKey: "gigDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),    
    cell: ({ row }) => {
      return (
        <span>{formatDate(row.original.gigDate)}</span>
      )
      
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
      )
    },
  },
    {
    accessorKey: "timeEnd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End" />
    ),
        cell: ({ row }) => {
      return (
        <span>{row.original.timeEnd?.toLocaleTimeString("en-US")}</span>
      )
    },
  },
      {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
        cell: ({ row }) => {
      return (
        <span>{row.original.timeStart && row.original.timeEnd ? calculateTimeDifference(row.original.timeStart, row.original.timeEnd) :0}</span>
      )
    },
  },
 
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
