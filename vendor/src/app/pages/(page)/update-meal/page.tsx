'use client'

import React, {useEffect} from 'react';
import useAuthStore from "@/app/store/authenticate";
import {useRouter} from "next/navigation";

const Page = () => {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login'); // Redirect to login page if not authenticated
            }
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }, [isAuthenticated, router]);

    // Optionally, you can return a loading indicator while checking authentication
    if (!isAuthenticated) {
        return null
    }
    return (
        <div>
            <h1>hello</h1>
        </div>
    );
};

export default Page;