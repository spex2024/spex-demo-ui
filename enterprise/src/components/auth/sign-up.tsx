'use client'
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import toast from "react-hot-toast";
import useAuth from "@/hook/auth";

const schema = z.object({
    company: z.string().nonempty('Company is required'),
    branch: z.string().nonempty('Branch is required'),
    location: z.string().nonempty('Location is required'),
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Password is required'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Confirm Password is required'),
    phone: z.string().nonempty('Phone number is required'),
    profilePhoto: z.any().optional(), // Changed to z.any() to handle file input
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

type FormData = z.infer<typeof schema>;

const SignUp: React.FC = () => {
    const { register, reset, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const { createAgency, success, error } = useAuth();

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const formData = new FormData();
        formData.append('company', data.company);
        formData.append('branch', data.branch);
        formData.append('location', data.location);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        formData.append('phone', data.phone);
        if (data.profilePhoto && data.profilePhoto[0]) {
            formData.append('profilePhoto', data.profilePhoto[0]);
        }

        try {
            await createAgency(formData);
            reset();
        } catch (error) {
            console.error('There was an error uploading the image:', error);
        }
    };

    const profilePhoto = watch('profilePhoto');

    const inputClass = 'w-full flex-1 appearance-none border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 text-sm focus:outline-none';
    const errorClass = 'text-red-500';

    return (
        <div className="w-full flex flex-wrap justify-center min-h-screen px-5">
            <div className="flex w-full min-h-screen flex-col justify-center items-center">
                <div className="text-center">
                    <div className="flex justify-center  ">
                        <img
                            alt="spex-africa"
                            className="w-auto h-32 sm:h-20"
                            src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                        />
                    </div>

                    <p className=" text-gray-500 dark:text-gray-300 text-xs">
                        Create a new account
                    </p>
                </div>
                <div className=" flex flex-col justify-center  md:justify-start px-10">
                    <form className="flex flex-col gap-2 " onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col pt-4">
                            <input type="text" {...register('company')} className={inputClass} placeholder="Company"/>
                            {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                        </div>

                        <div className="flex flex-col pt-4">
                            <input type="text" {...register('location')} className={inputClass} placeholder="Location"/>
                            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
                        </div>
                        <div className="flex flex-col pt-4">
                            <input type="email" {...register('email')} className={inputClass} placeholder="Email"/>
                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>
                        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3  h-auto">
                            <div className="w-full flex flex-col pt-4">
                                <input type="text" {...register('branch')} className={inputClass} placeholder="Branch"/>
                                   {errors.branch && <p className={errorClass}>{errors.branch.message}</p>}
                            </div>
                            <div className="w-full flex flex-col pt-4">
                                <input type="tel" {...register('phone')} className={inputClass} placeholder="Phone"/>
                                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                            </div>
                        </div>
                        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3  h-auto">
                            <div className="w-full flex flex-col pt-4">
                                <input type="password" {...register('password')} className={inputClass}
                                       placeholder="Password"/>
                                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                            </div>
                            <div className="w-full flex flex-col pt-4">
                                <input type="password" {...register('confirmPassword')} className={inputClass}
                                       placeholder="Confirm Password"/>
                                {errors.confirmPassword &&
                                    <p className={errorClass}>{errors.confirmPassword.message}</p>}
                            </div>
                        </div>


                        <div className="flex items-center space-x-6 pt-4">
                            <div className="shrink-0">
                                <img
                                    id='preview_img'
                                    className="h-10 w-10 object-cover rounded-full border-2 border-black"
                                    src={profilePhoto && profilePhoto.length ? URL.createObjectURL(profilePhoto[0]) : 'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'}
                                    alt="Current profile photo"
                                />
                            </div>
                            <label className="block">
                                <input
                                    type="file"
                                    {...register('profilePhoto')}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                            </label>
                        </div>

                            <button type="submit"
                                    className=" w-[40%] bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition mt-2 ">Sign
                                Up
                            </button>
                            <p className="whitespace-nowrap text-gray-600 flex gap-4 w-full items-center  mt-2 ">
                                Already have an account?
                                <Link href={'/login'}
                                      className="underline-offset-4 font-semibold text-gray-900 underline">Sign
                                    in.</Link>
                            </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
