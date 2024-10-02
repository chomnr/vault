'use client'

export const FloatingLogout = () => {
    const logout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include', 
        });
        window.location.href = '/login';
    };
    return (
    <div onClick={logout} className="floating-logout">
        L O G O U T
    </div>
    )
}