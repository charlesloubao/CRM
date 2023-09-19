import {AppBar} from "../AppBar.tsx";
import {Container} from "react-bootstrap";
import {PropsWithChildren} from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

export default withAuthenticationRequired(function AppLayout({children}: PropsWithChildren) {
    return <div>
        <AppBar/>
        <Container fluid className={"py-4"}>
            {children}
        </Container>
    </div>
}, {
    onRedirecting: () => <div>Loading...</div>
})