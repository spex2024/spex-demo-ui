import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const baseurl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : (typeof window !== 'undefined' && window.location.hostname.endsWith('.site'))
        ? 'https://api.spexafrica.site'
        : 'https://api.spexafrica.app';


const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            loading: true,
            error: null,
            fetchUser: async () => {
                set({ loading: true });
                try {
                    const response = await axios.get(`${baseurl}/api/enterprise/agencies`, { withCredentials: true });
                    set({ user: response.data, loading: false, error: null });
                } catch (error) {
                    set({
                        error: error.response ? error.response.data.message : 'An error occurred',
                        loading: false,
                    });
                }
            },
        }),
        {
            name: 'user-store', // Name to store in sessionStorage
            getStorage: () => sessionStorage, // Persist in session storage
        }
    )
);

export default useUserStore;
