'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Verify from "@/components/page/verify";

const InstallmentPaymentCallback = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference')
    const email = searchParams.get('email')
    const plan = searchParams.get('plan')
    const amount = searchParams.get('amount')
    const installmentDuration = searchParams.get('installmentDuration')
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<string | null>(null)
    const [paymentSent, setPaymentSent] = useState(false)
    const baseurl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : (typeof window !== 'undefined' && window.location.hostname.endsWith('.site'))
            ? 'https://api.spexafrica.site'
            : 'https://api.spexafrica.app';



    useEffect(() => {
        const verifyPayment = async () => {
            if (reference) {
                try {
                    const { data } = await axios.get(`${baseurl}/api/paystack/verify-payment/${reference}`)
                    console.log('Payment Verification Response:', data)

                    if (data.data.status === 'success') {
                        setStatus('Payment successful')
                        if (!paymentSent) {
                            await sendSelectedPlan()
                        }
                    } else {
                        setStatus('Payment failed')
                    }
                } catch (error) {
                    console.error('Payment verification error:', error)
                    setStatus('Error verifying payment')
                } finally {
                    setLoading(false)
                }
            }
        }

        verifyPayment()
    }, [reference, paymentSent])

    const sendSelectedPlan = async () => {
        try {
            await axios.post(`${baseurl}/api/paystack/record-installment`, {
                email,
                plan,
                amount: parseFloat(amount || '0'),
                reference,
                installmentDuration: parseInt(installmentDuration || '0'),
            })
            setPaymentSent(true)
        } catch (error) {
            console.error('Error sending payment information:', error)
        }
    }
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

    if (loading) {
        return (
          <>
              <Verify/>
          </>
        )
    }

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="flex flex-col items-center justify-center min-h-screen bg-white"
        >
            <motion.div
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.5}}
                className="p-12 rounded-lg text-center max-w-md w-full"
            >
                <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-6"
                >
                    {status === 'Payment successful' ? (
                        <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#71bc44"
                             strokeWidth="2">
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
                        <XCircle className="w-24 h-24 text-red-500 mx-auto"/>
                    )}
                </motion.div>
                <motion.h1
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.2, duration: 0.5}}
                    className={`text-3xl font-bold mb-4 ${status === 'Payment successful' ? 'text-[#71bc44]' : 'text-red-600'}`}
                >
                    {status}
                </motion.h1>
                <motion.p
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.3, duration: 0.5}}
                    className="text-gray-600 mb-8"
                >
                    {status === 'Payment successful'
                        ? 'Your transaction has been processed successfully.'
                        : 'There was an issue processing your payment. Please try again.'}
                </motion.p>
                <Link href={'/'}>
                    <Button
                        className="mt-4 bg-[#71bc44] hover:bg-[#5da036] text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                    >
                        Back to Dashboard
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    )
}

const PaymentCallbackWrapper = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#71bc44]">
                <Loader2 className="w-12 h-12 text-white animate-spin"/>
            </div>
        }>
            <InstallmentPaymentCallback/>
        </Suspense>
    )
}

export default PaymentCallbackWrapper