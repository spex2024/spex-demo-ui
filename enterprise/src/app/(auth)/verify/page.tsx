'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { MailCheck, MailWarning, MailX } from "lucide-react";
import ResendVerificationEmail from "@/components/auth/resend";

const VerificationContent: React.FC = () => {
    const searchParams = useSearchParams();
    const status = searchParams?.get('status');

    return (
        <>
            {status === 'success' ? (
                <>
                    <MailCheck color="#1a6d03" size={40} />
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        🎉 Congratulations! 🎉
                    </h3>
                    <p className="text-gray-600 my-2">Your account has been successfully verified!</p>
                    <p className="text-gray-600 my-2">You are now ready to explore all the exciting features and benefits that await you.</p>
                    <div className="py-10 text-center">
                        <Link href={"/login"} className="px-12 bg-black text-white font-semibold py-3">
                            Login
                        </Link>
                    </div>
                </>
            ) : status === 'expired' ? (
                <div className="w-full flex flex-col justify-center items-center">
                    <MailX color="#b04545" size={40} />
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Verification Failed
                    </h3>
                    <p className="text-red-600 my-2">Oops! It looks like your verification link has expired.</p>
                    <p className="text-gray-600 my-2">Please request a new verification email and try again.</p>
                    <div className="py-10 text-center">
                        <ResendVerificationEmail />
                    </div>
                </div>
            ) : status === 'verified' ? (
                <>
                    <MailWarning color="#b09e45" size={40} />
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Verification Failed
                    </h3>
                    <p className="text-red-600 my-2">Oops! User is already verified.</p>
                    <div className="py-10 text-center">
                        <Link href={"/login"} className="px-12 bg-black text-white font-semibold py-3">
                            Login
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <MailX color="#b04545" size={40} />
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Verification Issue
                    </h3>
                    <p className="text-gray-600 my-2">There was an issue with the verification process. <br/>Please check your email or try again later.</p>
                    <div className="py-10 text-center">
                        <ResendVerificationEmail />
                    </div>
                </>
            )}
        </>
    );
};

const Verification: React.FC = () => {
    return (
        <div className="bg-gray-100 h-screen w-full">
            <div className="bg-white p-6 md:mx-auto h-screen flex flex-col justify-center items-center w-full">
                <div className="text-center lg:w-[80%] lg:px-36 flex flex-col items-center justify-center w-full">
                    <Suspense fallback={<div>Loading...</div>}>
                        <VerificationContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Verification;
