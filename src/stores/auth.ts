import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, UserRole } from "@/data/types";

interface AuthState {
  profile: Profile | null;
  signIn: (profile: Profile) => void;
  signOut: () => void;
  setRole: (role: UserRole) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      signIn: (profile) => set({ profile }),
      signOut: () => set({ profile: null }),
      setRole: (role) =>
        set((state) =>
          state.profile ? { profile: { ...state.profile, role } } : state
        ),
    }),
    { name: "halawiyat-auth" }
  )
);
