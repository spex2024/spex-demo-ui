'use client'
import React, {useEffect, useState} from 'react';
import EmployeeData from "@/components/page/employees";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ClimbingBoxLoader, ScaleLoader} from "react-spinners";
import {useUserStore} from "@/store/profile";
interface User {
    packs?: number;
    subscription?: string;
    isActive?: boolean;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}
const Employees = () => {

    const { user, fetchUser } = useUserStore() as UserStore;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();

            // Wait for an additional 5 seconds after fetching user data
            setTimeout(() => {
                setLoading(false); // Set loading to false after 5 seconds
            },2000);
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
        router.push('/');
    }
    return (
        <div>
            <EmployeeData/>
        </div>
    );
};

export default Employees;