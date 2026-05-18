"use client"

import { ReactElement } from "react"
import { Table } from "@tanstack/react-table"

import { getColumnHeaderLabel } from "@/components/reui/data-grid/data-grid"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdownMenu"

interface DataGridColumnVisibilityProps<TData> {
  table: Table<TData>
  trigger: ReactElement<Record<string, unknown>>
}

function DataGridColumnVisibility<TData>({
  table,
  trigger,
}: DataGridColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="min-w-37.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            Toggle Columns
          </DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onClick={(event) => {
                  event.preventDefault()
                }}
                onCheckedChange={(value) => column.toggleVisibility(value === true)}
              >
                {getColumnHeaderLabel(column)}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataGridColumnVisibility, type DataGridColumnVisibilityProps }
