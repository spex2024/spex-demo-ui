'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import ResendVerificationEmail from "@/components/auth/resend";

const VerificationContent: React.FC = () => {
    const searchParams = useSearchParams()
    const status = searchParams?.get('status') || "success"

    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
                    title: "🎉 Congratulations! 🎉",
                    description: "Your account has been successfully verified!",
                    content: "You are now ready to explore all the exciting features and benefits that await you.",
                    action: (
                        <Button asChild className="bg-green-500 hover:bg-green-600 text-white w-full group">
                            <Link href="/login" className="flex items-center justify-center">
                                Login
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    ),
                    color: "text-green-500"
                }
            case 'expired':
                return {
                    icon: <XCircle className="h-16 w-16 text-red-500" />,
                    title: "Verification Failed",
                    description: "Oops! It looks like your verification link has expired.",
                    content: "Please request a new verification email and try again.",
                    action: (
                        <ResendVerificationEmail/>
                    ),
                    color: "text-red-500"
                }
            case 'verified':
                return {
                    icon: <XCircle className="h-16 w-16 text-red-500" />,
                    title: "Verification Failed",
                    description: "Oops! User is already verified.",
                    action: (
                        <Button asChild className="bg-red-500 hover:bg-red-600 text-white w-full group">
                            <Link href="/login" className="flex items-center justify-center">
                                Login
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    ),
                    color: "text-red-500"
                }
            default:
                return {
                    icon: <XCircle className="h-16 w-16 text-red-500" />,
                    title: "Verification Issue",
                    description: "There was an issue with the verification process.",
                    content: "Please check your email or try again later.",
                    action: (
                       <ResendVerificationEmail/>
                    ),
                    color: "text-red-500"
                }
        }
    }

    const { icon, title, description, content, action, color } = getStatusConfig()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
        >
            <div className="flex flex-col items-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {icon}
                </motion.div>
                <h2 className={`text-3xl font-bold text-center ${color}`}>{title}</h2>
                <p className="text-xl text-center text-gray-600">{description}</p>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={content}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center text-gray-600"
                    >
                        {content}
                    </motion.p>
                </AnimatePresence>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                >
                    {action}
                </motion.div>
            </div>
        </motion.div>
    )
}

const Verification: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <Suspense fallback={
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xl font-medium text-gray-600"
                >
                    Loading...
                </motion.div>
            }>
                <VerificationContent />
            </Suspense>
        </div>
    )
}

export default Verification