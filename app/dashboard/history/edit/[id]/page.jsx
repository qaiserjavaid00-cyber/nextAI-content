import { getQueryById } from "@/app/actions/query";
import EditClient from "../../_components/edit-client";

const Page = async ({ params }) => {

    const data = await getQueryById(params.id);
    if (!data) {
        return <div>No Data found</div>;
    }

    return <EditClient queryData={data} />;
};

export default Page;