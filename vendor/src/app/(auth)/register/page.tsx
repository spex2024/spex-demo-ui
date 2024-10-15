'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import useAuth from "@/app/hook/auth";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserIcon, MapPinIcon, MailIcon, PhoneIcon, LockIcon, CameraIcon, CheckCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = useForm<SignUpFormInputs>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });

    const { addVendor, success, error } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'profilePhoto' && value[0]) {
                formData.append(key, value[0]);
            } else if (typeof value === 'string') {
                formData.append(key, value);
            }
        });

        try {
            await addVendor(formData);
            reset();
        } catch (error) {
            console.error('There was an error during sign up:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const profilePhoto = watch('profilePhoto');

    const carouselImages = [
        "https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541196/spex_jrkich.jpg",
        "https://res.cloudinary.com/ddwet1dzj/image/upload/v1728939934/image_ghxi2u.jpg",
        "https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541343/hero-1_raxkds.jpg"
    ];

    const inputVariants = {
        focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
    };

    const formFields = [
        { name: 'company', label: 'Company Name', icon: UserIcon, placeholder: ' Boheneko Restaurant', fullWidth: true },
        { name: 'location', label: 'Location', icon: MapPinIcon, placeholder: 'Adenta Muncipality' },
        { name: 'email', label: 'Email Address', icon: MailIcon, placeholder: ' boheneko@gmail.com', type: 'email' },
        { name: 'phone', label: 'Phone Number', icon: PhoneIcon, placeholder: '0244 000 000 / +233 244 000 000', type: 'tel' },
        { name: 'owner', label: 'Owner Name', icon: UserIcon, placeholder: 'David Osei' },
        { name: 'password', label: 'Password', icon: LockIcon, placeholder: '••••••••', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', icon: LockIcon, placeholder: '••••••••', type: 'password' },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
            <Card className="w-full md:w-1/3 overflow-y-auto p-4 md:p-6 bg-[#f0f4f8] shadow-2xl rounded-none">
                <CardHeader className="text-center pb-4">
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        alt="spex-africa"
                        className="w-auto h-20 md:h-36 mx-auto mb-4 animate-pulse"
                        src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                    />
                    <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Join SPEX</CardTitle>
                    <p className="text-gray-600 text-sm">Start your sustainable food journey today</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formFields.map((field) => (
                                <div key={field.name} className={`space-y-1 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                                    <Label htmlFor={field.name} className="text-gray-700 text-sm font-medium">{field.label}</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus">
                                        <field.icon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <Input
                                            id={field.name}
                                            type={field.type || 'text'}
                                            {...register(field.name as keyof SignUpFormInputs)}
                                            placeholder={field.placeholder}
                                            className="pl-8 pr-2 py-1 text-sm border-gray-300 bg-transparent focus:border-[#71bc44] focus:ring-[#71bc44] rounded-md placeholder:text-xs"
                                        />
                                        {errors[field.name as keyof SignUpFormInputs] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[field.name as keyof SignUpFormInputs]?.message as string}</p>
                                        )}
                                    </motion.div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 bg-transparent p-3 rounded-lg">
                            <div className="shrink-0">
                                <img
                                    className="h-16 w-16 object-cover rounded-full border-2 border-[#71bc44] shadow-lg"
                                    src={profilePhoto?.length ? URL.createObjectURL(profilePhoto[0]) : 'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'}
                                    alt="Profile photo preview"
                                />
                            </div>
                            <label className="block flex-1">
                                <span className="sr-only">Choose profile photo</span>
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setValue('profilePhoto', e.target.files);
                                            }
                                        }}
                                        className="block w-full text-xs text-gray-500 bg-transparent file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#71bc44] file:text-white hover:file:bg-[#5fa439] transition-all duration-300"
                                    />
                                    <CameraIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </label>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                className="w-full bg-[#71bc44] hover:bg-[#5fa439] text-white py-2 rounded-md transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <CheckCircleIcon size={18} />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                    <p className="mt-4 text-center text-xs text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-[#71bc44] hover:text-[#5fa439] transition-colors duration-300">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>

            <div className="hidden md:block w-2/3 relative overflow-hidden">
                <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    effect="fade"
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    loop={true}
                    className="h-full"
                >
                    {carouselImages.map((image, index) => (
                        <SwiperSlide key={index} className="relative h-full">
                            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
                                <h2 className="text-white text-4xl font-bold mb-4">Elevate Your Food Business with SPEX</h2>
                                <p className="text-white text-lg  font-light max-w-4xl">
                                    Join our innovative platform and connect with enterprises seeking sustainable meal packaging solutions. Expand your market reach, increase your sales, and contribute to a more sustainable food industry.
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default SignUp;