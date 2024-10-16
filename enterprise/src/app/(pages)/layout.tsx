'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Header from "@/components/page/header";
import Footer from "@/components/page/footer";
import { useUserStore } from "@/store/profile";
import { useRouter } from "next/navigation";
import { ClimbingBoxLoader } from "react-spinners";

interface LayoutProps {
    children: ReactNode;
}

interface User {
    packs?: number;
    subscription?: string;
    isActive?: boolean;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, fetchUser } = useUserStore() as UserStore;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();

            // Wait for an additional 5 seconds after fetching user data
            setTimeout(() => {
                setLoading(false); // Set loading to false after 5 seconds
            },5000);
        };

        loadUser();
    }, [fetchUser]);

    if (loading) {
        // Show a loading indicator for 5 seconds
        return (
            <div className="flex items-center justify-center h-screen">
                <ClimbingBoxLoader color="#71bc44" size={20} />
            </div>
        );
    }

    if (user?.isActive === false) {
        router.push('/subscribe');
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
