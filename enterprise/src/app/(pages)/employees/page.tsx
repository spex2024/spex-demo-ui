'use client'
import React, {useEffect} from 'react';
import EmployeeData from "@/components/page/employees";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";
import {useUserStore} from "@/store/profile";

const Employees = () => {

    const { isAuthenticated } = useAuthStore();
    const { user, fetchUser } = useUserStore()
    const router = useRouter();
    console.log(user)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login'); // Redirect to login page if not authenticated
            }
        }, 3000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }, [isAuthenticated, router]);

    // Optionally, you can return a loading indicator while checking authentication
    if (!isAuthenticated) {
        return null
    }

    return (
        <div>
            <EmployeeData/>
        </div>
    );
};

export default Employees;