'use client'

import React, {useEffect} from 'react';
import AddMealForm from "@/components/main/meal-form";
import useAuthStore from "@/app/store/authenticate";
import {useRouter} from "next/navigation";


const AddMeal = () => {
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
        <div className={` w-full min-h-screen flex flex-col justify-center items-center  gap-10 lg:py-30 py-10`}>
            <div className={`lg:w-[40%] h-20 px-8 lg:px-0`}>

            <h1 className={`font-bold lg:text-5xl`}>Add Meal</h1>
                <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
            </div>
            <AddMealForm/>
        </div>
    );
};

export default AddMeal;