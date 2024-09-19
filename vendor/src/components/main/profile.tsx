'use client';

import React, { useEffect } from 'react';
import { LogIn, Trash2 } from 'lucide-react';

import { useRouter } from "next/navigation";
import Skeleton from "@/components/main/skeleton";
import useAuth from "@/app/hook/auth";
import useVendorStore from "@/app/store/vendor";
import UpdateVendorForm from "@/components/main/profile-update";


interface Vendor {
    _id: string;
    name: string;
    location: string;
    code:string;
    email?: string;
    phone: string;
    owner: string;
    imageUrl?: string;
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
    const { vendor, fetchVendor, loading } = useVendorStore() as { vendor: Vendor | null; fetchVendor: () => void; loading: boolean };

    useEffect(() => {
        fetchVendor();
    }, [fetchVendor]);

    if (loading) {
        return <Skeleton />;
    }

    if (!vendor) {
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
                            className="rounded lg:h-36 lg:w-32 h-24 w-20"
                            src={vendor?.imageUrl}
                            alt="Profile"
                        />
                    </div>
                    <div className="w-full flex flex-row flex-wrap h-full">
                        <div className="w-full flex flex-col items-center justify-center gap-5 text-gray-700 font-semibold relative">
                            <div className="w-full text-sm flex flex-col gap-1 text-black">
                                <p>{vendor.name} - ({vendor.code})</p>
                                <p>{vendor.location}</p>
                                <p>{vendor.email}</p>
                                <p>{vendor.phone}</p>
                            </div>
                            <div className="w-full text-gray-300 hover:text-gray-400 cursor-pointer ">
                                <UpdateVendorForm vendor={vendor} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
