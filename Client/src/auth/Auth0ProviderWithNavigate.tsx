import {Auth0Provider} from "@auth0/auth0-react";
import {PropsWithChildren} from "react";
import {useNavigate} from "react-router-dom";
import auth0config from "./auth0config.ts";

export const Auth0ProviderWithNavigate = ({children}: PropsWithChildren) => {
    const navigate = useNavigate();

    const domain = auth0config.domain;
    const clientId = auth0config.clientId;
    const redirectUri = auth0config.redirectUri;

    const onRedirectCallback = (appState: any) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    if (!(domain && clientId && redirectUri)) {
        return null;
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};