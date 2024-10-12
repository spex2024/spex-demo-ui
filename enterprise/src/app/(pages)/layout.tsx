'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Header from "@/components/page/header";
import Footer from "@/components/page/footer";
import { useUserStore } from "@/store/profile";
import { useRouter } from "next/navigation";

interface LayoutProps {
    children: ReactNode;
}

interface User {
    packs?: number;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, fetchUser } = useUserStore() as UserStore;
    const router = useRouter()
    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    if(user?.packs === 0){
        router.push('/subscribe')
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
