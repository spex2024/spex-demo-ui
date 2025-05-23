import { create } from 'zustand';
import axios from 'axios';

const baseurl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://api.spexafrica.app';


const useVendorStore = create((set) => ({
    vendor: [],
    loading: true,
    fetchVendor: async () => {
        try {
            const response = await axios.get(`${baseurl}/api/vendor/vendor`, { withCredentials: true });
            set({ vendor: response.data , loading: false });
        } catch (error) {
            console.error('Error fetching vendor:', error);
        }
    }
}));

export default useVendorStore;
