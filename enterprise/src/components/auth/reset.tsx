'use client';

import React, { Suspense, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeySquare } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from "next/navigation";
import useAuth from "@/hook/auth";

// Define the schema and form data types
const passwordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long")
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ResetPasswordForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema)
    });

    const searchParams = useSearchParams();
    const { resetPassword, success, error } = useAuth();
    const token = searchParams.get("token");

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<PasswordFormData> = async data => {
        if (token) {
            await resetPassword(data, token);
        } else {
            toast.error("Token not found");
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="w-full flex justify-center h-screen">
                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-[80%]">
                    <div className="flex-1">
                        <p className="w-full mt-3 text-black text-sm">
                            Password playing hide and seek? No worries!<br /> Set a new one and get back on track!
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
                                Don&#x27;t have an account yet? <Link href={'/sign-up'}>
                                <span className="text-black font-bold leading-tight text-md">sign up</span>
                            </Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

const Reset: React.FC = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default Reset;
