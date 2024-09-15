'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import ResendVerificationEmail from "@/components/main/resend";
import { MailX, MailCheck, MailWarning } from 'lucide-react';

const VerificationContent= () => {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    return (
        <div className="bg-gray-100 h-screen w-full border">
            <div className="bg-white p-6 md:mx-auto h-screen flex flex-col justify-center items-center w-full">
                <div className="text-center lg:w-[50%] lg:px-36 h-screen flex flex-col justify-center items-center w-full">
                    {status === 'success' ? (
                        <div className="flex flex-col justify-center items-center w-full">
                            <MailCheck color="#1a6d03" size={60} />
                            <h1 className="lg:text-4xl text-base text-green-700 font-semibold text-center mt-5">
                                🎉 Congratulations! 🎉
                            </h1>
                            <p className="text-gray-600 my-2">Your account has been successfully verified!</p>
                            <p className="text-gray-600 my-2">You are now ready to explore all the exciting features and benefits that await you.</p>
                            <div className="py-10 text-center w-full h-64">
                                <Link href={"/login"}>
                                    <button type="submit" className="bg-gray-900 px-8 py-2 text-center text-base font-semibold text-white shadow-md transition">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : status === 'expired' ? (
                        <div className="w-full flex flex-col justify-center items-center">
                            <MailX color="#b04545" size={60} />
                            <h1 className="lg:text-4xl text-base text-red-700 font-semibold text-center mt-5">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 my-2">Oops! It looks like your verification link has expired.</p>
                            <p className="text-gray-600 my-2">Please request a new verification email and try again.</p>
                            <div className="py-10 text-center">
                                <ResendVerificationEmail />
                            </div>
                        </div>
                    ) : status === 'verified' ? (
                        <div className="w-full flex flex-col justify-center items-center">
                            <MailWarning color="#b09e45" size={60} />
                            <h1 className="lg:text-4xl text-base text-yellow-500 font-semibold text-center mt-5">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 my-2">Oops! User is already verified.</p>
                            <div className="py-10 text-center">
                                <Link href={"/login"}>
                                    <button type="submit" className="bg-gray-900 px-8 py-2 text-center text-base font-semibold text-white shadow-md transition">
                                        Login
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 flex-col justify-center items-center flex w-full">
                            <MailX color="#b04545" size={60} />
                            <h1 className="lg:text-4xl text-base text-red-700 font-bold text-center flex justify-center items-center w-full mt-5">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 my-2">There was an issue with the verification process.</p>
                            <p className="text-gray-600 my-2">Please check your email or try again later.</p>
                            <div className="py-10 text-center">
                                <ResendVerificationEmail />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Verification = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationContent />
        </Suspense>
    );
};

export default Verification;
