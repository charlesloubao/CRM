import {withAuthenticationRequired} from "@auth0/auth0-react";
import {useQuery} from "react-query";
import axios from "axios";
import {Organization} from "../../Api.ts";
import {Link} from "react-router-dom";

export default withAuthenticationRequired(function OrganizationsListPage() {
    const organizations = useQuery(["organizations"], async () => await axios.get<Organization[]>("/api/organizations")
        .then(response => response.data))

    return <div>
        <h1>Pick an organization</h1>

        {organizations.data && <div>{organizations.data.map(organization => (
            <div key={organization.organizationId}><Link
                to={`/app/organizations/${organization.organizationId}`}>{organization.name}</Link></div>
        ))}</div>}
    </div>
})