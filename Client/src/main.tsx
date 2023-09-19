import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {QueryClient, QueryClientProvider} from 'react-query'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import AuthCallbackPage from "./pages/AuthCallbackPage.tsx";
import DashboardPage from "./pages/app/DashboardPage.tsx";
import AppRoot from './pages/app/AppRoot.tsx';

const queryClient = new QueryClient()


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {
                path: "/app", element: <AppRoot/>,
                children: [
                    {path: "", element: <DashboardPage/>}
                ],
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
