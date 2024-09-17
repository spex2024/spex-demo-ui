'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import useAuth from "@/app/hook/auth";
import { toast } from "react-hot-toast";

const schema = z.object({
    company: z.string().nonempty('Company name is required'),
    location: z.string().nonempty('Location is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().nonempty('Phone number is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Password is required'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Confirm Password is required'),
    owner: z.string().nonempty('Owner name is required'),
    profilePhoto: z.any().refine((file) => file && file.length > 0, 'Profile photo is required'),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type SignUpFormInputs = z.infer<typeof schema>;

const SignUp: React.FC = () => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(schema),
    });

    const { addVendor, success, error } = useAuth();

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    // Map user data to options for the Select component


    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        const formData = new FormData();
        formData.append('company', data.company);
        formData.append('location', data.location);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        formData.append('owner', data.owner);
        if (data.profilePhoto && data.profilePhoto[0]) {
            formData.append('profilePhoto', data.profilePhoto[0]);
        } else {
            console.error('No file selected or file length is zero');
        }

        try {
            await addVendor(formData);
            reset();
        } catch (error) {
            console.error('There was an error uploading the image:', error);
        }
    };

    const profilePhoto = watch('profilePhoto');


    const inputClass = 'w-full flex-1 appearance-none border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 text-sm focus:outline-none';
    const errorClass = 'text-red-500';

    return (
        <div className="flex flex-wrap">
            <div className="flex w-full justify-center items-center min-h-screen flex-col md:w-1/3 px-5">
                <div className="text-center">
                    <div className="flex justify-center ">
                        <img
                            alt="spex-africa"
                            className="w-auto h-32 sm:h-28"
                            src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                        />
                    </div>

                    <p className=" text-gray-500 dark:text-gray-300 text-sm">
                        Create a new account
                    </p>
                </div>
                <div className="w-full flex flex-col justify-center  md:justify-start md:px-4 md:pt-0  ">
                    <form className="flex flex-col gap-2  px-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col pt-4">
                            <input type="text" {...register('company')} className={inputClass}
                                   placeholder="Vendor / Restaurant"/>
                            {errors.company && <p className={errorClass}>{errors.company.message}</p>}
                        </div>
                        <div className="flex flex-col pt-4">
                            <input type="text" {...register('location')} className={inputClass} placeholder="Location"/>
                            {errors.location && <p className={errorClass}>{errors.location.message}</p>}
                        </div>
                        <div className="flex flex-col pt-4">
                            <input type="email" {...register('email')} className={inputClass}
                                   placeholder="john@gcb.org"/>
                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>


                        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3  h-auto">
                            <div className="w-full flex flex-col pt-4">
                                <input type="text" {...register('owner')} className={inputClass} placeholder="Owner"/>
                                {errors.owner && <p className={errorClass}>{errors.owner.message}</p>}
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
                                <img id='preview_img'
                                     className="h-10 w-10 object-cover rounded-full border-2 border-black"
                                     src={profilePhoto?.length ? URL.createObjectURL(profilePhoto[0]) : 'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'}
                                     alt="Current profile photo"/>
                            </div>
                            <label className="block">
                                <span className="sr-only">Choose profile photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setValue('profilePhoto', e.target.files);
                                        }
                                    }}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                                />
                            </label>
                        </div>
                        <button type="submit"
                                className="mt-5 w-[50%] bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition">Sign
                            Up
                        </button>
                    </form>
                    <div className="mt-5 w-full flex items-start justify-start px-5">
                        <p className="whitespace-nowrap text-gray-600 flex gap-4 w-full items-center ">
                            Already have an account?
                            <Link href={'/login'} className="underline-offset-4 font-semibold text-gray-900 underline">Sign
                                in.</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-2/3">
                <div className="absolute bottom-0 z-10 px-8 text-white opacity-100">
                    <p className="mb-8 text-3xl font-semibold leading-10">SPEX is a meal marketplace that leverages a
                        web platform/app to connect food vendors with enterprises and users seeking sustainable food
                        packaging.</p>
                </div>
                <img className="absolute top-0 h-full w-full object-cover opacity-40 -z-1" src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541196/spex_jrkich.jpg" alt="Background" />
            </div>
        </div>
    );
};

export default SignUp;
