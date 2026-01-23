import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "ADMIN";
  createdAt?: Date;
}

interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null; // Timestamp when token expires
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // Track if store has been rehydrated from storage
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkTokenExpiry: () => boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      setToken: (token) => set({ token }),
      
      login: (user, token) => {
        const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
        set({ 
          user, 
          token, 
          tokenExpiry: expiryTime,
          isAuthenticated: true,
          error: null 
        });
      },
      
      logout: () => {
        // Clear cookie
        if (typeof document !== 'undefined') {
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        set({ 
          user: null, 
          token: null,
          tokenExpiry: null,
          isAuthenticated: false,
          error: null 
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      checkTokenExpiry: () => {
        const { tokenExpiry, logout } = get();
        if (tokenExpiry && Date.now() >= tokenExpiry) {
          logout();
          return true; // Token expired
        }
        return false; // Token still valid
      },
      
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
