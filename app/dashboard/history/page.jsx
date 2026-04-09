// import React from 'react'

// import { getQueries } from '@/app/actions/query'

// import { DataTable } from './_components/data-table'
// import { queryColumns } from './_components/columns'

// import { authOptions } from '@/utls/authOptions'
// import { getServerSession } from 'next-auth'
// import { redirect } from 'next/navigation'


// const HistoryPage = async () => {
//     const session = await getServerSession(authOptions);

//     const result = await getQueries(session?.user?.email)
//     const queries = result?.queries

//     return (
//         <div>
//             <DataTable data={queries} columns={queryColumns} />
//         </div>
//     )
// }
// export default HistoryPage

import React from "react";
import { getQueries } from "@/app/actions/query";
import { DataTable } from "./_components/data-table";
import { queryColumns } from "./_components/columns";

import { authOptions } from "@/utls/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const HistoryPage = async ({ searchParams }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const page = Number(searchParams?.page) || 1;
    const pageSize = Number(searchParams?.pageSize) || 10;

    const result = await getQueries(page, pageSize);
    const queries = result?.queries || [];
    const totalPages = result?.totalPages || 1;

    return (
        <div className="p-4">
            <DataTable
                data={queries}
                columns={queryColumns}
                totalPages={totalPages}
                page={page}
                pageSize={pageSize}
            />
        </div>
    );
};

export default HistoryPage;