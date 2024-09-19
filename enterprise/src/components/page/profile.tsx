'use client';

import React, { useEffect } from 'react';
import { LogIn, Trash2 } from 'lucide-react';
import UpdateEntForm from '@/components/page/profile-update';
import { useUserStore } from '@/store/profile';
import useAuth from "@/hook/auth";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/page/skeleton";

// Define the expected shape of your User or Enterprise object
interface Enterprise {
    _id: string;
    company: string;
    branch: string;
    code: string;
    location: string;
    email: string;
    phone: string;
    imageUrl: string;
}

const ProfileTab: React.FC = () => {
    const { logout, success, error } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login'); // Redirect to the login page after logout
    };

    return (
        <div className="w-[80%] flex flex-col gap-20 ">
            <Card />

            <div className="w-[80%] flex flex-col items-start justify-center mx-auto mt-5 text-red-700 cursor-pointer">
                <span className="w-full flex items-center gap-3 border-b py-3" onClick={handleLogout}>
                    <LogIn />
                    <p>Logout</p>
                </span>
                <span className="w-full flex items-center gap-3 py-3">
                    <Trash2 />
                    <p>Delete</p>
                </span>
            </div>
        </div>
    );
};

export default ProfileTab;

const Card = () => {
    const { user, fetchUser, loading } = useUserStore() as { user: Enterprise | null; fetchUser: () => void; loading: boolean };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if (loading) {
        return <Skeleton />;
    }

    if (!user) {
        return <div className="w-full flex justify-center items-center text-gray-500">No user data available</div>;
    }

    return (
        <div className="w-full bg-white flex items-center flex-row flex-wrap p-3">
            <div className="mx-auto w-full">
                <div
                    className="w-full flex items-center justify-center h-52 px-3"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo/1578836537282-3171d77f8632?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')",
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundBlendMode: 'multiply',
                    }}
                >
                    <div className="h-full w-[60%] flex items-center justify-center">
                        <img
                            className="rounded-full lg:h-36 lg:w-32 h-24 w-20"
                            src={user?.imageUrl}
                            alt="Profile"
                        />
                    </div>
                    <div className="w-full flex flex-row flex-wrap h-full">
                        <div className="w-full flex flex-col items-center justify-center gap-5 text-gray-700 font-semibold relative">
                            <div className="w-full text-sm flex flex-col gap-1 text-black">
                                <p>{user.company} - ({user.code})</p>
                                <p>{user.location}</p>
                                <p>{user.email}</p>
                                <p>{user.phone}</p>
                            </div>
                            <div className="w-full text-gray-300 hover:text-gray-400 cursor-pointer ">
                                <UpdateEntForm agency={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
