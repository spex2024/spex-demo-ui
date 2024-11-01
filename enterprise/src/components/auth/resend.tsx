'use client'

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import useAuth from "@/hook/auth";
import {ArrowRight} from "lucide-react";
import {Button} from "@/components/ui/button";


const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).nonempty('Email is required'),
});

type ResendVerificationEmailFormData = z.infer<typeof schema>;

const ResendVerificationEmail: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ResendVerificationEmailFormData>({
        resolver: zodResolver(schema),
    });

    const { resendVerification, success, error } = useAuth();

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<ResendVerificationEmailFormData> = async (data) => {
        await resendVerification(data);
    };

    const inputClass = 'w-full border border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 text-sm focus:outline-none';
    const errorClass = 'text-red-500';

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md px-6">
                <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <input type="email" {...register('email')} className={inputClass} placeholder="Email" />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>

                    <Button type='submit' className="bg-red-500 hover:bg-red-600 text-white w-full group">
                        Resend Verification
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResendVerificationEmail;
