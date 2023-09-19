import {Container} from "react-bootstrap";
import {useAuth0} from "@auth0/auth0-react";

export function AppBar() {
    const {isAuthenticated, logout, user} = useAuth0();
    return <Container fluid className={"text-bg-primary px-4 py-3 shadow"}>
        <div className={"fw-bold fs-4"}>
            CRM.NET
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
    </Container>;
}