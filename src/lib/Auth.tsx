import React from "react";
import { Navigate } from "react-router";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
        return <Navigate to={"/login"} />;
    }

    return children;
};

const RequireNoAuth = ({ children }: { children: React.ReactNode }) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
        return <Navigate to={"/"} />;
    }

    return children;
};

export { RequireAuth, RequireNoAuth };
