'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authenticate';
import { ScaleLoader } from 'react-spinners';
import Dashboard from '@/components/page/dashboard';
import NotificationModal from '@/components/page/notification';
import useVendorStore from '@/store/vendors';
import Footer from "@/components/page/footer";
import {useUserStore} from "@/store/profile";
interface User {
    packs?: number

}
interface UserStore {
    user?: User
    fetchUser: () => Promise<void>
}
const App: React.FC = () => {

    const { user, fetchUser } = useUserStore() as UserStore
    const router = useRouter()
    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    if(user?.packs === 0){
        router.push('/subscribe')
    }
    return (
        <div>
            <Dashboard/>
            <Footer/>

        </div>
    );
};

export default App;
