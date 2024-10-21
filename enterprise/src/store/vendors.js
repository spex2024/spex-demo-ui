// stores/vendorStore.js
import {create} from 'zustand';
import axios from 'axios';


// const baseurl = 'https://api.spexafrica.app';

const baseurl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://api.spexafrica.app';

const useVendorStore = create((set) => ({
    vendors: [],
    loading: false,
    error: null,

    fetchVendors: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${baseurl}/api/enterprise/vendors`, { withCredentials: true });
            set({ vendors: response?.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

}));

export default useVendorStore;
