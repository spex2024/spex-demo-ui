'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Component() {
    const [status, setStatus] = useState('Payment successful')
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (status === 'Payment successful') {
            setShowConfetti(true)
            const timer = setTimeout(() => setShowConfetti(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [status])

    const iconVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.5
            }
        }
    }

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeInOut",
                delay: 0.5
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl text-center max-w-md w-full relative overflow-hidden"
            >
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        {[...Array(50)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                initial={{
                                    x: '50%',
                                    y: '50%',
                                    scale: 0,
                                }}
                                animate={{
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: Math.random() * 1.5 + 0.5,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    repeat: Infinity,
                                    repeatType: 'loop',
                                }}
                            />
                        ))}
                    </motion.div>
                )}
                <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-6"
                >
                    {status === 'Payment successful' ? (
                        <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                            <motion.path
                                variants={pathVariants}
                                d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                            />
                            <motion.path
                                variants={pathVariants}
                                d="M22 4L12 14.01l-3-3"
                            />
                        </svg>
                    ) : (
                        <XCircle className="w-24 h-24 text-red-500 mx-auto" />
                    )}
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold mb-4"
                >
                    {status}
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-gray-600 mb-6"
                >
                    {status === 'Payment successful'
                        ? 'Your transaction has been processed successfully. Thank you for your purchase!'
                        : 'There was an issue processing your payment. Please check your payment details and try again.'}
                </motion.p>
                <Link href={'/'} className="inline-block">
                    <Button
                        className={`mt-4 ${
                            status === 'Payment successful'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}