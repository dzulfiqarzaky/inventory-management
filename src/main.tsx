import React from "react";
import ReactDOM from "react-dom/client";
import App, { SidebarData } from "./App.jsx";
import {
    RouterProvider,
    createBrowserRouter,
    Route,
    createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import RawMaterialPage from "./pages/RawMaterial/index.js";
import ProductionPage from "./pages/Production/index.js";
import CustomerPage from "./pages/Customer/index.js";
import SupplierPage from "./pages/Supplier/index.js";
import UserPage from "./pages/User/index.js";
import DashboardPage from "./pages/Dashboard";
import LoginPage from "./pages/Login/index.js";
import ProductPage from "./pages/Product/index.js";
import BillPage from "./pages/Bill/index.js";
import RawMaterialUsePage from "./pages/RawMaterialUsed/index.js";
import RawMaterialTransactionPage from "./pages/RawMaterialTransaction/index.js";
import PurchaseOrderPage from "./pages/PurchaseOrder/index.js";
import { GlobalStateProvider } from "./store/index.js";
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

const queryCache = new QueryCache({});
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            cacheTime: 0,
            staleTime: Infinity,
            retry: 3,
        },
    },
    queryCache,
});

const getComponentPage = (componentName: any) => {
    switch (componentName) {
        case "Raw Material Transaction":
            return RawMaterialTransactionPage;
        case "Raw Material Used":
            return RawMaterialUsePage;
        case "Raw Material":
            return RawMaterialPage;
        case "Product":
            return ProductPage;
        case "Production":
            return ProductionPage;
        case "Purchase Order":
            return PurchaseOrderPage;
        case "Customer":
            return CustomerPage;
        case "Supplier":
            return SupplierPage;
        case "User":
            return UserPage;
        case "Bill":
            return BillPage;
        default:
            // eslint-disable-next-line react/display-name
            return () => <div>404</div>;
    }
};
const generateNestedRoutes = (children: any[]) => {
    return children.map((child) => {
        const ComponentPage = getComponentPage(child.label);
        return (
            <Route
                key={child.label}
                path={child.path}
                element={<ComponentPage />}
            />
        );
    });
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={
                <GlobalStateProvider>
                    <App />
                </GlobalStateProvider>
            }
        >
            <Route index={true} path="/" element={<DashboardPage />} />
            <Route index={true} path="/login" element={<LoginPage />} />
            {SidebarData.map((sidebarComponent) => {
                const { label, path, children } = sidebarComponent;
                if (path) {
                    const ComponentPage = getComponentPage(label);
                    return (
                        <Route
                            key={label}
                            path={path}
                            element={<ComponentPage />}
                        />
                    );
                } else if (children) {
                    return <>{generateNestedRoutes(children)}</>;
                }

                return null;
            })}
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
