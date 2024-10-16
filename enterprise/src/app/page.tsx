'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/page/dashboard';
import Footer from "@/components/page/footer";
import { useUserStore } from "@/store/profile";
import {ClimbingBoxLoader} from "react-spinners";

interface User {
    packs?: number;
    subscription?: string;
    isActive?: boolean;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}

const App: React.FC = () => {
    const { user, fetchUser } = useUserStore() as UserStore;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();

            // Wait for an additional 5 seconds after fetching user data
            setTimeout(() => {
                setLoading(false); // Set loading to false after 5 seconds
            }, 3000);
        };

        loadUser();
    }, [fetchUser]);

    if (loading) {
        // Optionally show a loading indicator while user data is being fetched
        return   <div  className={`flex items-center justify-center h-screen`}>
            <ClimbingBoxLoader color="#71bc44" size={20} />;
        </div>
    }

    if (user?.isActive === false) {
        router.push('/subscribe');
    }

    return (
        <div>
            <Dashboard />
            <Footer />
        </div>
    );
};

export default App;
