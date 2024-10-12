import { create } from 'zustand';
import axios from 'axios';

const baseurl = 'https://api.spexafrica.site';
// const baseurl = "http://localhost:8080";

const usePlans = create((set) => ({
    plans: [], // Store for plans
    loading: false,
    error: null,

    fetchPlans: async () => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get(`${baseurl}/api/subscriptions/plans`, { withCredentials: true });
            console.log(response)
            set({ plans: response?.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));

export default usePlans;
