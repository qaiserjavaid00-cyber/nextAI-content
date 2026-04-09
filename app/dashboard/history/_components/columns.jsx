"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const wordCount = (text) =>
    text.trim().split(/\s+/).length;

export const queryColumns = [

    {
        accessorKey: "template",
        header: "Template",
        cell: ({ row }) => {
            const template = row.original.template;
            return (
                <div className="flex items-center gap-2">
                    <Image
                        src={template.icon}
                        alt={template.name}
                        width={20}
                        height={20}
                    />
                    <span>{template.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "query",
        header: "Query",
        cell: ({ row }) => (
            <div className="line-clamp-2 max-w-xs">
                {row.original.query}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
            new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
        header: "Words",
        cell: ({ row }) => wordCount(row.original.content),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const router = useRouter();
            const { content, _id } = row.original;

            const handleCopy = async () => {
                await navigator.clipboard.writeText(content);
                toast.success("Copied to clipboard");
            };

            const handleEdit = () => {

                router.push(`/dashboard/history/edit/${_id}`)
                // toast("Edit clicked (wire modal/page)");
            };

            const handleDelete = () => {
                toast.error("Delete not wired yet");
                // call delete server action here
            };

            return (
                <div className="flex items-center gap-3">
                    <button onClick={handleCopy}>
                        <Copy className="h-4 w-4 text-gray-500" />
                    </button>

                    <button onClick={handleEdit}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                    </button>

                    <button onClick={handleDelete}>
                        <Trash className="h-4 w-4 text-red-500" />
                    </button>
                </div>
            );
        },
    },
];
