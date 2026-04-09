// "use client";

// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
// } from "@tanstack/react-table";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";

// export function DataTable({
//     columns,
//     data,
// }) {
//     const table = useReactTable({
//         data,
//         columns,
//         getCoreRowModel: getCoreRowModel(),
//     });

//     return (
//         <div className="rounded-md border">
//             <Table>
//                 <TableHeader>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <TableRow key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => (
//                                 <TableHead key={header.id}>
//                                     {header.isPlaceholder
//                                         ? null
//                                         : flexRender(
//                                             header.column.columnDef.header,
//                                             header.getContext()
//                                         )}
//                                 </TableHead>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableHeader>

//                 <TableBody>
//                     {table.getRowModel().rows?.length ? (
//                         table.getRowModel().rows.map((row) => (
//                             <TableRow key={row.id}>
//                                 {row.getVisibleCells().map((cell) => (
//                                     <TableCell key={cell.id}>
//                                         {flexRender(
//                                             cell.column.columnDef.cell,
//                                             cell.getContext()
//                                         )}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell
//                                 colSpan={columns.length}
//                                 className="h-24 text-center"
//                             >
//                                 No results.
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// }


"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";

export function DataTable({ columns, data, totalPages, page, pageSize }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages,
        state: {
            pagination: { pageIndex: page - 1, pageSize },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true, // server-side pagination
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function"
                    ? updater({ pageIndex: page - 1, pageSize })
                    : updater;
            const newPage = newPagination.pageIndex + 1;
            const newPageSize = newPagination.pageSize;

            // Update URL with next page
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage);
            params.set("pageSize", newPageSize);
            router.push(`?${params.toString()}`);
        },
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <button
                        className="border rounded px-2 py-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={page <= 1}
                    >
                        First
                    </button>
                    <button
                        className="border rounded px-2 py-1"
                        onClick={() => table.previousPage()}
                        disabled={page <= 1}
                    >
                        Previous
                    </button>
                    <button
                        className="border rounded px-2 py-1"
                        onClick={() => table.nextPage()}
                        disabled={page >= totalPages}
                    >
                        Next
                    </button>
                    <button
                        className="border rounded px-2 py-1"
                        onClick={() => table.setPageIndex(totalPages - 1)}
                        disabled={page >= totalPages}
                    >
                        Last
                    </button>
                </div>

                <span className="text-sm">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>

                <select
                    className="border rounded px-2 py-1"
                    value={pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            Show {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}