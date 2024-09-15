'use client'

import React, {useEffect} from 'react';
import OrderData from "@/components/page/orders";
import useAuthStore from "@/store/authenticate";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";

const Orders = () => {
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
            <OrderData/>
        </div>
    );
};

export default Orders;