// stores/vendorStore.js
import {create} from 'zustand';
import axios from 'axios';

// const baseurl = 'https://enterprise-backend.vercel.app';
// const baseurl = 'https://api.spexafrica.site';
// const baseurl = "http://localhost:8080";

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

    updateVendor: async (vendorId, updatedData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.patch(`${baseURL}/api/admin/vendors/${vendorId}`, updatedData, { withCredentials: true });
            if (response.status === 200) {
                set((state) => ({
                    vendors: state.vendors.map(vendor =>
                        vendor._id === vendorId ? { ...vendor, ...updatedData } : vendor
                    ),
                    loading: false,
                }));
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    setError: (error) => set({ error }),
}));

export default useVendorStore;
