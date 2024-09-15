'use client'

import React, {useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeySquare } from "lucide-react";
import Link from "next/link";
import useAuth from "@/app/hook/auth";
import toast, { Toaster } from 'react-hot-toast';
import {useRouter ,useSearchParams} from "next/navigation";

const passwordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 8 characters long")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(passwordSchema)
    });
    const searchParams = useSearchParams()
    const {resetPassword , success, error}= useAuth()

    const token = searchParams.get("token");
    useEffect(() => {
        if (success) {
            toast.success(success);

        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit = async data => {
        await resetPassword(data , token)

    };

    return (
        <div className="bg-white ">
            <div className="flex justify-center h-screen">
                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <p className="w-full mt-3 text-black text-sm">
                            Password playing hide and seek? No worries!<br/> Set a new one and get back on track!
                        </p>

                        <div className="mt-8">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mt-10">
                                    <input
                                        type="password"
                                        {...register("newPassword")}
                                        placeholder="new password"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md"
                                    />
                                    {errors.newPassword && <p className="text-red-600">{errors.newPassword.message}</p>}
                                </div>
                                <div className="mt-5">
                                    <input
                                        type="password"
                                        {...register("confirmPassword")}
                                        placeholder="confirm password"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md"
                                    />
                                    {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
                                </div>

                                <div className="w-full mt-10 flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="lg:w-[50%] flex justify-center gap-2 items-center px-2 py-3 tracking-wide text-white transition-colors duration-200 transform bg-black"
                                    >
                                        <KeySquare size={20} /> reset password
                                    </button>
                                    <Link href={'/login'} className="text-sm font-semibold text-white">
                                        <p className="text-gray-900 leading-tight">back to login</p>
                                    </Link>
                                </div>
                            </form>

                            <p className="flex gap-3 w-full mt-10 text-md text-center text-gray-400">
                                Don&#x27;t have an account yet? <Link href={'/login'}>
                                <span className="text-black font-bold leading-tight text-md">sign up</span>
                            </Link>.
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="hidden bg-cover lg:block lg:w-2/3"
                    style={{backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"}}
                >
                    <div className="w-full flex flex-row-reverse items-center h-full px-20 bg-gray-900 bg-opacity-40">
                        <div className="w-[80%]" style={{ direction: "rtl" }}>
                            <h2 className="text-4xl font-bold text-white">SPEX AFRICA</h2>
                            <p className="mt-3 text-gray-300">
                                Did you know? The average plastic bag is used for just 12 minutes but can take up to
                                1,000 years to decompose, significantly impacting the environment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



const Reset = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPassword/>
        </Suspense>
    );
};

export  default  Reset;
