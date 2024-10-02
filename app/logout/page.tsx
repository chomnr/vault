'use client'

import { useEffect } from "react";

export default function Login() {
    const handleLogout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', 
        });
        window.location.href = '/login';
    };
    useEffect(() => {
        handleLogout();
    }, []);
    return (null)
}