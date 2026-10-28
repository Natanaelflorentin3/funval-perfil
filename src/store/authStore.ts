import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "../types/user";

// Estado GLOBAL de la sesión con Zustand.
// `persist` lo guarda en localStorage para no perder la sesión al recargar.
interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "funval-auth" } // clave en localStorage
  )
);
