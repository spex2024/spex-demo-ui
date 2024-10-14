'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Header from "@/components/page/header";
import Footer from "@/components/page/footer";
import { useUserStore } from "@/store/profile";
import { useRouter } from "next/navigation";
import {ClimbingBoxLoader} from "react-spinners";

interface LayoutProps {
    children: ReactNode;
}

interface User {
    packs?: number;
    subscription?: string;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, fetchUser } = useUserStore() as UserStore
    const router = useRouter()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();
            setLoading(false); // Set loading to false after fetching user data
        };

        loadUser();
    }, [fetchUser]);

    if (loading) {
        // Optionally show a loading indicator while user data is being fetched
        return <div className={`flex items-center justify-center h-screen`}>
            <ClimbingBoxLoader color="#71bc44" size={20}/>;
        </div>;
    }

    if (!user?.subscription) {
        router.push('/subscribe');
        return null; // Prevent rendering the rest of the component after redirect
    }

    return (

        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>

    );
};

export default Layout;
