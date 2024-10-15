'use client'

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import toast from "react-hot-toast";
import useAuth from "@/hook/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (success) {
            toast.success(success);
            setIsSubmitting(false);
        } else if (error) {
            toast.error(error);
            setIsSubmitting(false);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
        setIsSubmitting(true);
        await login(data);
    };

    return (
        <div className="w-full flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md px-6 py-8 bg-white shadow-md rounded-lg">
                <div className="text-center mb-6">
                    <img
                        alt="spex-africa"
                        className="w-auto h-24 mx-auto mb-4"
                        src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                    />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">
                        Sign in to access your account
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="text-sm text-right">
                        <Link href="/password/request" className="text-blue-600 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </motion.div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Do not have an account?{' '}
                    <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;