'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import useAuth from "@/hook/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import {AtSign, Briefcase, MapPin, Phone, Lock, Loader2, ArrowRight} from 'lucide-react'

const schema = z.object({
    company: z.string().nonempty('Company is required'),
    branch: z.string().nonempty('Branch is required'),
    location: z.string().nonempty('Location is required'),
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Password is required'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Confirm Password is required'),
    phone: z.string().nonempty('Phone number is required'),
    profilePhoto: z.any().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

type FormData = z.infer<typeof schema>

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        let i = 0
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayText((prev) => prev + text.charAt(i))
                i++
            } else {
                clearInterval(typingInterval)
            }
        }, 100)

        return () => clearInterval(typingInterval)
    }, [text])

    return <span>{displayText}</span>
}

const InputWithIcon: React.FC<{
    icon: React.ReactNode,
    label: string,
    name: string,
    type?: string,
    register: any,
    error?: string
}> = ({ icon, label, name, type = "text", register, error }) => (
    <div className="relative">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/50">
                {icon}
            </div>
            <Input
                id={name}
                type={type}
                {...register(name)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50 mb-2  pl-10 pr-4 py-2 w-full rounded-md focus:ring-2 focus:ring-[#71bc44] focus:border-transparent transition duration-200 ease-in-out placeholder:text-white"
                placeholder={label}
            />
        </div>
        {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
    </div>
)

export default function Component() {
    const { register, reset, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    })

    const { createAgency, success, error } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const formData = new FormData()
        formData.append('company', data.company)
        formData.append('branch', data.branch)
        formData.append('location', data.location)
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('confirmPassword', data.confirmPassword)
        formData.append('phone', data.phone)
        if (data.profilePhoto && data.profilePhoto[0]) {
            formData.append('profilePhoto', data.profilePhoto[0])
        }

        try {
            setIsSubmitting(true)
            await createAgency(formData)
            reset()
        } catch (error) {
            console.error('There was an error uploading the image:', error)
        }
    }

    const profilePhoto = watch('profilePhoto')

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-8" style={{backgroundImage: "url('https://res.cloudinary.com/ddwet1dzj/image/upload/v1720549684/office-1_delwsn.jpg')"}}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-2xl relative z-10 bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center mb-4"
                        >
                            <img
                                alt="spex-africa"
                                className="w-auto h-24 animate-pulse"
                                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                            />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold text-white mb-4">
                            <TypewriterText text="Embrace Smart Pack!" />
                        </CardTitle>
                        <p className="mt-2 text-sm text-gray-200 mb-5">
                            Be part of the sustainable food packaging revolution! Together, we can make a difference, one smart pack at a time.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputWithIcon
                                    icon={<Briefcase className="h-5 w-5" />}
                                    label="Company"
                                    name="company"
                                    register={register}
                                    error={errors.company?.message}

                                />
                                <InputWithIcon
                                    icon={<Briefcase className="h-5 w-5" />}
                                    label="Branch"
                                    name="branch"
                                    register={register}
                                    error={errors.branch?.message}
                                />
                                <InputWithIcon
                                    icon={<MapPin className="h-5 w-5" />}
                                    label="Location"
                                    name="location"
                                    register={register}
                                    error={errors.location?.message}
                                />
                                <InputWithIcon
                                    icon={<Phone className="h-5 w-5" />}
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    register={register}
                                    error={errors.phone?.message}
                                />
                            </div>
                            <InputWithIcon
                                icon={<AtSign className="h-5 w-5" />}
                                label="Email"
                                name="email"
                                type="email"
                                register={register}
                                error={errors.email?.message}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputWithIcon
                                    icon={<Lock className="h-5 w-5" />}
                                    label="Password"
                                    name="password"
                                    type="password"
                                    register={register}
                                    error={errors.password?.message}
                                />
                                <InputWithIcon
                                    icon={<Lock className="h-5 w-5" />}
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    register={register}
                                    error={errors.confirmPassword?.message}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="shrink-0">
                                    <img
                                        id='preview_img'
                                        className="h-12 w-12 object-cover rounded-full border-2 border-white/30"
                                        src={profilePhoto && profilePhoto.length ? URL.createObjectURL(profilePhoto[0]) : 'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'}
                                        alt="Profile photo preview"
                                    />
                                </div>
                                <Label htmlFor="profilePhoto" className="cursor-pointer bg-white/20 px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/30 transition-colors">
                                    Upload Photo
                                    <Input id="profilePhoto" type="file" {...register('profilePhoto')} className="hidden" />
                                </Label>
                            </div>
                            <Button type="submit" className="w-full bg-[#71bc44] hover:bg-[#5da438] text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing Up...
                                    </>
                                ) : (
                                    <>
                                        Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-200">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-[#71bc44] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}