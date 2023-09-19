import './App.css'
import {Outlet} from "react-router-dom";
import {Auth0ProviderWithNavigate} from "./auth/Auth0ProviderWithNavigate.tsx";


function App() {
    return <Auth0ProviderWithNavigate>
        <Outlet/>
    </Auth0ProviderWithNavigate>
}

export default App
