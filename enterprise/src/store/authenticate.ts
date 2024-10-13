import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

// Define the shape of your store state
interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    setIsAuthenticated: (status: boolean) => void;
    setLoading: (status: boolean) => void;
    logout: () => void; // Add a method for logging out
}

// Create the Zustand store with TypeScript types and session storage persistence
const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            isLoading: true,
            setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),
            setLoading: (status: boolean) => set({ isLoading: status }),
            logout: () => {
                set({ isAuthenticated: false, isLoading: true }); // Reset the state
                sessionStorage.removeItem('auth-storage'); // Clear the session storage
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => {
                console.log("Rehydrating storage...");
                // Optionally, you can handle loading state here if needed
            },
        } as PersistOptions<AuthState>,
    ),
);

export default useAuthStore;
