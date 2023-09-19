import {Outlet} from "react-router-dom";
import AppLayout from "../../components/layouts/AppLayout.tsx";

export default function AppRoot() {
    return <AppLayout>
        <Outlet/>
    </AppLayout>
}