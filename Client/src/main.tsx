import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {QueryClient, QueryClientProvider} from 'react-query'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.tsx";
import DashboardPage from "./pages/app/organizations/DashboardPage.tsx";
import OrganizationsListPage from "./pages/app/PickOrganizationPage.tsx";
import OrganizationRoot from "./pages/app/organizations/OrganizationRoot.tsx";

const queryClient = new QueryClient()


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "/app", element: <Navigate to={"/app/organizations"}/>},
            {path: "/app/organizations", element: <OrganizationsListPage/>},
            {
                path: "/app/organizations/:orgId", element: <OrganizationRoot/>,
                children: [
                    {path: "", element: <DashboardPage/>}
                ]
            },
            {path: "callback", element: <AuthCallbackPage/>}
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </React.StrictMode>,
)
