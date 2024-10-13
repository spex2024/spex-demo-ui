'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/page/dashboard';
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
