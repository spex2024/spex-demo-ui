import { create } from 'zustand';
import axios from 'axios';

// const baseurl = 'http://localhost:8080';
const baseurl = 'https://api.spexafrica.site';

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
