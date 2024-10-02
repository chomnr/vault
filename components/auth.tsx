import { isAuthenticated } from "@/config/actions";
import React from "react";
import { ReactNode } from "react";

interface AuthenticatedProps {
    children: ReactNode;
}

export const Authenticated: React.FC<AuthenticatedProps> = async ({ children }) => {
    let isLoggedIn = await isAuthenticated();
    if (!isLoggedIn) {
        return null
    }
    return <>{children}</>
}