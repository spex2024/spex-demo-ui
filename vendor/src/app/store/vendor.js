import { create } from 'zustand';
import axios from 'axios';

// const baseurl = 'https://enterprise-backend.vercel.app';
// const baseurl = 'http://localhost:8080';
const baseurl = 'https://enterprise-backend-l6pn.onrender.com';

const useVendorStore = create((set) => ({
    vendor: [],
    fetchVendor: async () => {
        try {
            const response = await axios.get(`${baseurl}/api/vendor/vendor`, { withCredentials: true });
            set({ vendor: response.data });
        } catch (error) {
            console.error('Error fetching vendor:', error);
        }
    }
}));

export default useVendorStore;
