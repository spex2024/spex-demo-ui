'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2 } from 'lucide-react';
import toast from "react-hot-toast";
import useAuth from "@/hook/auth";

// Define the schema and form data types
const emailSchema = z.object({
    email: z.string().email("Invalid email address")
});

type EmailFormData = z.infer<typeof emailSchema>;

const Request: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema)
    });

    const { resetRequest, success, error } = useAuth();

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
        await resetRequest(data);
    };

    return (
        <div className="bg-white w-full">
            <div className="flex justify-center w-full ">


                <div className="flex flex-col items-center justify-center w-full   ">
                    <div className="w-[60%] space-y-10">

                        <p className="w-full  text-black text-sm">
                            Forgot your password? No worries! <br/> Enter your email below to receive a password reset
                            link.
                        </p>
                        <div className=" w-full">
                            <form onSubmit={handleSubmit(onSubmit)} className={`w-full`}>
                                <div className={`flex flex-col  w-full`}>
                                    <label htmlFor="email" className="block mb-2 text-sm text-black">Email
                                        Address</label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        id="email"
                                        placeholder="example@example.com"
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md"
                                    />
                                    {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                                </div>

                                <div className="w-full mt-6 flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="lg:w-[40%] flex justify-center gap-2 items-center px-2 py-3 tracking-wide text-white transition-colors duration-200 transform bg-black"
                                    >
                                        <Link2 size={20}/> send request
                                    </button>
                                    <Link href={'/login '} className="text-sm font-semibold text-white">
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
        </div>
    );
};

export default Request;
