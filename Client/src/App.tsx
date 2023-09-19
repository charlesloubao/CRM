import './App.css'
import {Outlet} from "react-router-dom";
import {Auth0ProviderWithNavigate} from "./auth/Auth0ProviderWithNavigate.tsx";
import AxiosProvider from "./components/AxiosProvider.tsx";


function App() {
    return <Auth0ProviderWithNavigate>
        <AxiosProvider>
            <Outlet/>
        </AxiosProvider>
    </Auth0ProviderWithNavigate>
}

export default App
