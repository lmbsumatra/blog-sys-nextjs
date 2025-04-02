import { User } from "@/lib/types";
import axios from "axios";
import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import Cookies from 'js-cookie';

interface AuthStore {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    role: "user" | "admin" | "superadmin" | null;
    setAuth: (token: string) => Promise<void>;
    fetchUser: () => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
    isUser: () => boolean;
    isAdmin: () => boolean;
    hasPermission: (requiredRole: "user" | "admin" | "superadmin") => boolean;
}

interface FetchUserResponse {
    user: User;
    role: "user" | "admin" | "superadmin";
}

type AuthStorePersist = Pick<AuthStore, 'token' | 'role' | 'isAuthenticated'>;


const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            role: null,

            setAuth: async (token) => {
                if (token) {
                    Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'Strict' });
                } else {
                    Cookies.remove('auth-token');
                }

                set({ token, isAuthenticated: !!token });

                if (token) {
                    await get().fetchUser();
                }
            },

            fetchUser: async () => {
                const token = get().token;
                if (!token) return;

                try {
                    const response = await axios.get<FetchUserResponse>("http://localhost:3000/api/user", {
                        headers: { Authorization: token },
                    });

                    if (!response || !response.data) {
                        get().logout();
                        throw new Error("Failed to fetch user");
                    }

                    const { user, role } = response.data;
                    set({
                        user: user,
                        role: role as "user" | "admin" | "superadmin" | null
                    });

                } catch (error) {
                    console.error("Error fetching user:", error);
                    get().logout();
                }
            },

            logout: async () => {
                try {
                    const response = await fetch('/api/auth/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Logout API returned an error');
                    }

                    Cookies.remove('auth-token');

                    set({
                        token: null,
                        user: null,
                        isAuthenticated: false,
                        role: null
                    });

                    window.location.href = '/login';

                } catch (err) {
                    console.error('Error during logout:', err);
                }
            },

            isAdmin: () => get().role === "admin",
            isUser: () => get().role === "user",

            hasPermission: (requiredRole) => {
                const userRole = get().role;
                return userRole === requiredRole;
            },

            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : userData as User
                })),
        }),
        {
            name: "auth-storage",
            storage: typeof window !== 'undefined' ? window.localStorage : undefined, 
            partialize: (state): AuthStorePersist => ({
                token: state.token,
                role: state.role,
                isAuthenticated: state.isAuthenticated,
            }),
        } as PersistOptions<AuthStore, AuthStorePersist>
    )
);

export default useAuthStore;
