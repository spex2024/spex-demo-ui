'use client'
import React, {useEffect} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import toast from "react-hot-toast";
import useAuth from "@/hook/auth";

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).nonempty('Email is required'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty('Password is required'),
});

type SignInFormInputs = z.infer<typeof schema>;

const SignIn: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({
        resolver: zodResolver(schema),
    });

    const { login, success, error } = useAuth();
    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
        await login(data);
    };

    const inputClass = 'w-full flex-1 appearance-none border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 text-sm focus:outline-none';
    const errorClass = 'text-red-500';

    return (
        <div className="flex flex-col h-screen">
            <div className="flex w-full flex-col md:w-1/3 ">
                <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
                    <a href="#" className="border-b-gray-700 border-b-4 pb-2 text-2xl font-bold text-gray-900">SPEX.</a>
                </div>
                <div className="mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-4 md:pt-0 mt-20 lg:w-[30rem]">
                    <form className="flex flex-col gap-3 pt-3 md:pt-8 lg:mt-28" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col pt-4">
                            <input type="email" {...register('email')} className={inputClass} placeholder="Email" />
                            {errors.email && <p className={errorClass}>{errors.email?.message}</p>}
                        </div>
                        <div className="flex flex-col pt-4">
                            <input type="password" {...register('password')} className={inputClass} placeholder="Password" />
                            {errors.password && <p className={errorClass}>{errors.password?.message}</p>}
                        </div>
                        <div className="flex flex-col pt-4 text-sm text-gray-500 underline">
                            <Link href={'/password/request'}>
                                <p>forgot password</p>
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="mt-8 w-[50%] bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition"
                        >
                            Log in
                        </button>
                    </form>
                    <div className="mt-7 w-full flex items-start justify-start">
                        <p className="whitespace-nowrap text-gray-600 flex gap-4 w-full items-center">
                            Do not have an account?
                            <Link href={'/sign-up'} className="underline-offset-4 font-semibold text-gray-900 underline">Sign up for free.</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
