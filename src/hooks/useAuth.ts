// src/hooks/useAuth.ts
export function useAuth() {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return { user, isLoggedIn: !!user, logout };
}