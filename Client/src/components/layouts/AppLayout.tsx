import {AppBar} from "../AppBar.tsx";
import {Stack} from "react-bootstrap";
import {PropsWithChildren} from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

export default withAuthenticationRequired(function AppLayout({children}: PropsWithChildren) {
    return <Stack className={"h-100"}>
        <AppBar/>
        <div className={"flex-grow-1"}>
            {children}
        </div>
    </Stack>
}, {
    onRedirecting: () => <div>Loading...</div>
})