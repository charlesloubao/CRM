import {Outlet, useParams} from "react-router-dom";
import AppLayout from "../../../components/layouts/AppLayout.tsx";
import {useQuery} from "react-query";
import axios from "axios";
import {Organization} from "../../../Api.ts";

export default function OrganizationRoot() {
    const {orgId} = useParams()
    const organizationDetails = useQuery(["organizations", orgId],
        () => axios.get<Organization>(`/api/organizations/${orgId}`)
            .then(response => response.data))

    if (organizationDetails.isLoading) {
        return <div>Loading...</div>
    } else if (organizationDetails.isError) {
        return <div>An error occurred</div>
    }

    return <AppLayout>
        <Outlet/>
    </AppLayout>
}