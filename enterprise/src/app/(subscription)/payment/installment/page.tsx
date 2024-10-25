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
        : 'https://api.spexafrica.app'

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


    if (loading) {
        return (
          <>
              <Verify/>
          </>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen bg-[#71bc44]"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
                {status === 'Payment successful' ? (
                    <CheckCircle className="w-16 h-16 text-[#71bc44] mx-auto mb-4" />
                ) : (
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <h1 className={`text-2xl font-bold mb-4 ${status === 'Payment successful' ? 'text-[#71bc44]' : 'text-red-600'}`}>
                    {status}
                </h1>
                <Link href={'/'}>
                    <Button className="mt-4 bg-[#71bc44] hover:bg-[#5da036] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
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
                <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
        }>
            <InstallmentPaymentCallback />
        </Suspense>
    )
}

export default PaymentCallbackWrapper