import {AppBar} from "../AppBar.tsx";
import {Container} from "react-bootstrap";
import {PropsWithChildren, useCallback} from "react";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import axios, {InternalAxiosRequestConfig} from "axios";

export default withAuthenticationRequired(function AppLayout({children}: PropsWithChildren) {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0()

    const middleware = useCallback(async (args: InternalAxiosRequestConfig) => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently()
            args.headers.Authorization = `Bearer ${token}`
        }
        return args
    }, [isAuthenticated])

    axios.interceptors.request.use(middleware)

    return <div>
        <AppBar/>
        <Container fluid className={"py-4"}>
            {children}
        </Container>
    </div>
}, {
    onRedirecting: () => <div>Loading...</div>
})