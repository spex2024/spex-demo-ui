// stores/userStore.ts
import {create} from 'zustand';
import axios from 'axios';

 const baseurl = 'https://api.spexafrica.site';
// const baseurl = 'http://localhost:8080';

interface User {
    name: string;
    // Add other user properties as needed
}

interface UserState {
    user: {} | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    error: null,
    fetchUser: async () => {
        try {
            const response = await axios.get<{ user: User }>(`${baseurl}/api/enterprise/agency`, { withCredentials: true });
            console.log('API Response:', response.data); // Debugging line
            set({ user: response.data, loading: false, error: null });
        } catch (error) {
            console.error('Error fetching user:', error); // Debugging line
            const err = error as { response?: { data?: { message: string } } };
            set({
                user: null,
                loading: false,
                error: err.response?.data?.message || 'An error occurred',
            });
        }
    }



}));
