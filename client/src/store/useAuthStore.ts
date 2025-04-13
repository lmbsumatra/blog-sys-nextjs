
import axios from "axios";
import { create } from "zustand";
import Cookies from 'js-cookie';
import { User } from "../types/types";

interface AuthStore {
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

const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    role: null,

    setAuth: async (token) => {
        if (token) {
            Cookies.set('auth-token', token, { expires: 7, secure: true, sameSite: 'Strict' });
        } else {
            Cookies.remove('auth-token');
        }

        set({ isAuthenticated: !!token });

        if (token) {
            await get().fetchUser();
        }
    },

    fetchUser: async () => {
        try {
            const response = await axios.get<FetchUserResponse>("http://localhost:3001/api/user", {
                withCredentials: true, 
            });

            const { user, role } = response.data;
            set({
                user,
                role: role as "user" | "admin" | "superadmin",
                isAuthenticated: true,
            });

        } catch (error) {
            console.error("Error fetching user:", error);
            get().logout();
        }
    },

    logout: async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout API returned an error');
            }

            Cookies.remove('auth-token');

            set({
                user: null,
                isAuthenticated: false,
                role: null,
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
            user: state.user ? { ...state.user, ...userData } : userData as User,
        })),
}));

export default useAuthStore;
