"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetColumns } from "./columns";

interface DataTableProps<TData, TValue> {
    // columns: ColumnDef<TData, TValue>[];
    data: TData[];
    openingDetails: any;
}

export function ApplicantsDataTable<TData, TValue>({ data, openingDetails }: DataTableProps<TData, TValue>) {
    const columns = useGetColumns({ openingDetails });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        // getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="rounded-md border max-h-[76vh] overflow-auto">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
