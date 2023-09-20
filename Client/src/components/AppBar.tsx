import {Stack} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";
import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import {Organization} from "../Api.ts";

export function AppBar() {
    const {isAuthenticated, logout, user} = useAuth0();
    const {orgId} = useParams()

    const cachedResponse = useQuery<Organization>(["organizations", orgId])

    return <Stack direction={"horizontal"} className={"text-bg-primary px-4 py-3 justify-content-between"}>
        <div className={"fw-bold fs-4"}>
            CRM.NET / {cachedResponse.data!.name}
        </div>
        <div>
            {(isAuthenticated && user) ? <div>
                    <div>{user.email}</div>
                    <button onClick={() => {
                        logout({
                            logoutParams: {returnTo: window.location.origin}
                        })
                    }}>Sign out
                    </button>
                </div>
                : <div>
                    <button>Sign in</button>
                </div>}
        </div>
    </Stack>;
}