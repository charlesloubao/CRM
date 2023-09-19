import {useAuth0} from "@auth0/auth0-react";
import {Link} from "react-router-dom";

export default function HomePage() {
    const {isAuthenticated} = useAuth0()
    return <div>
        <div>CRM.NET</div>
        <div>
            <Link to={"/app"}>{isAuthenticated ? "Go to dashboard" : "Get started"}</Link>
        </div>
    </div>
}