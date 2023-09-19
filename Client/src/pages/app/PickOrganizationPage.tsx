import {withAuthenticationRequired} from "@auth0/auth0-react";
import {useQuery} from "react-query";
import axios from "axios";
import {Organization} from "../../Api.ts";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default withAuthenticationRequired(function OrganizationsListPage() {
    const organizations = useQuery(["organizations"], async () => await axios.get<Organization[]>("/api/organizations")
        .then(response => response.data))

    const navigate = useNavigate()

    useEffect(() => {
        if (organizations.data && organizations.data.length === 1) {
            navigate(`/app/organizations/${organizations.data[0].organizationId}`)
        }
    }, [organizations])

    if (organizations.isLoading) {
        return <div>Loading...</div>
    } else if (organizations.isError) {
        return <div>An error occurred...</div>
    } else if (organizations.data?.length === 1) return <div/> // We redirect to the first org if only one is found so nothing to show here

    return <div>
        <h1>Pick an organization</h1>

        {organizations.data && <div>{organizations.data.map(organization => (
            <div key={organization.organizationId}>
                <Link
                    to={`/app/organizations/${organization.organizationId}`}>{organization.name}</Link></div>
        ))}</div>}
    </div>
})