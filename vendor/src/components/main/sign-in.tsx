'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import toast from "react-hot-toast"
import useAuth from "../../app/hook/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, Loader2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/autoplay'

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).nonempty('Email is required'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty('Password is required'),
})

type SignInFormInputs = z.infer<typeof schema>

const carouselImages = [
    "https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541196/spex_jrkich.jpg",
    "https://res.cloudinary.com/ddwet1dzj/image/upload/v1728939934/image_ghxi2u.jpg",
    "https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541343/hero-1_raxkds.jpg"
];

export default function SignIn() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormInputs>({
        resolver: zodResolver(schema),
    })
    const [showPassword, setShowPassword] = useState(false)
    const { login, success, error } = useAuth()

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
        await login(data)
    }

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Swiper
                    modules={[EffectFade, Autoplay]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    speed={1000}
                    className="h-full w-full"
                >
                    {carouselImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="h-full w-full">
                                <img
                                    src={image}
                                    alt={`Background ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black opacity-60"></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <Card className="relative z-10 w-full max-w-md backdrop-blur-xl bg-black/30 border-none shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <img
                        alt="spex-africa"
                        className="w-auto h-24 mx-auto mb-4"
                        src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                    />
                    <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
                    <p className="text-gray-300">Sign in to access your account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="relative">
                            <Input
                                type="email"
                                {...register('email')}
                                placeholder="Email"
                                className="bg-white/10 border-none text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-[#71bc44] transition-all duration-300 placeholder:text-white"
                            />
                            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                placeholder="Password"
                                className="bg-white/10 border-none text-white placeholder-gray-400 pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-[#71bc44] transition-all duration-300 placeholder:text-white"
                            />
                            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                            >
                                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <Link href="/reset/request" className="text-sm text-[#71bc44] hover:text-[#8ed462] transition-colors duration-300">
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#71bc44] hover:bg-[#5fa439] text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:bg-[#71bc44] disabled:hover:scale-100"
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
                    </form>
                </CardContent>
                <CardFooter className="text-center pt-2">
                    <p className="text-sm text-gray-300">
                        Do not have an account?{' '}
                        <Link href="/register" className="text-[#71bc44] hover:text-[#8ed462] font-semibold transition-colors duration-300">
                            Sign up for free
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}