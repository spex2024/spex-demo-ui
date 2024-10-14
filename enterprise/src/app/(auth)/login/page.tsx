'use client'

import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import toast from "react-hot-toast"
import useAuth from "@/hook/auth"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

const schema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).nonempty('Email is required'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty('Password is required'),
})

type SignInFormInputs = z.infer<typeof schema>

export default function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>({
        resolver: zodResolver(schema),
    })

    const { login, success, error } = useAuth()
    const [showPassword, setShowPassword] = React.useState(false)

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
        <div className="flex min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden">
            <div
                className="absolute inset-0 bg-black/60"
                style={{
                    backgroundImage: "url('https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541341/hero_tg9gt8.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay'
                }}
            ></div>
            <div className="flex flex-col md:flex-row items-center justify-center w-full p-4 z-10">
                <div className="md:w-1/2 max-w-xl text-center md:text-left mb-8 md:mb-0 md:pr-8 animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 hidden md:block">Corporate Lunch in Reusable Packs</h1>
                    <p className="text-sm md:text-base font-light text-white/90">
                        SPEX simplifies meal planning for your team, saving you time and reducing costs while minimizing plastic waste. Experience convenient, eco-friendly meal solutions that enhance your corporate dining experience.
                    </p>
                </div>
                <Card className="w-full md:w-1/2 max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-lg animate-fade-in">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <img
                                alt="spex-africa"
                                className="h-20 w-auto animate-pulse"
                                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                            />
                        </div>
                        <CardTitle className="text-xl font-bold text-center text-white">Sign in</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm text-white">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register('email')}
                                        className="bg-white/20 border-white/30 text-white placeholder-white/60 text-sm pl-10 focus:ring-2 focus:ring-[#71bc44] transition-all duration-300 ease-in-out placeholder:text-gray-100"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                {errors.email && <p className="text-xs text-red-300 animate-shake">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm text-white">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        className="bg-white/20 border-white/30 text-white placeholder-white/60 text-sm pl-10 focus:ring-2 focus:ring-[#71bc44] transition-all duration-300 ease-in-out placeholder:text-gray-100"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-white/60" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-white/60" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-300 animate-shake">{errors.password.message}</p>}
                            </div>
                            <Link href="/password/request" className="text-xs text-[#71bc44] hover:text-[#8cd45f] transition-colors duration-300">
                                Forgot password?
                            </Link>
                            <Button type="submit" className="w-full bg-[#71bc44] hover:bg-[#5fa438] text-white text-sm transition-all duration-300 ease-in-out transform hover:scale-105">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-center text-white/80 w-full">
                            Do not have an account?{' '}
                            <Link href="/sign-up" className="text-[#71bc44] hover:text-[#8cd45f] font-medium transition-colors duration-300">
                                Sign up for free
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}