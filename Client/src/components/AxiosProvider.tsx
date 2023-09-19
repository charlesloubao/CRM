import {PropsWithChildren, useCallback} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios, {InternalAxiosRequestConfig} from "axios";

export default function AxiosProvider({children}: PropsWithChildren) {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0()

    const middleware = useCallback(async (args: InternalAxiosRequestConfig) => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently()
            args.headers.Authorization = `Bearer ${token}`
        }
        return args
    }, [isAuthenticated])

    axios.interceptors.request.use(middleware)

    return <>{children}</>
}