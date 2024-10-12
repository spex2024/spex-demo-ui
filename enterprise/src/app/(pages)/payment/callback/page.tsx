// app/payment/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// PaymentCallback component to handle payment verification and display status
const PaymentCallback = ({ reference, email, plan, amount }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    const [paymentSent, setPaymentSent] = useState(false);
    const baseurl = 'https://api.spexafrica.site';

    useEffect(() => {
        const verifyPayment = async () => {
            if (reference) {
                try {
                    const { data } = await axios.get(`${baseurl}/api/paystack/verify-payment/${reference}`);
                    console.log('Payment Verification Response:', data);

                    if (data.data.status === 'success') {
                        setStatus('Payment successful');
                        if (!paymentSent) {
                            await sendSelectedPlan();
                        }
                    } else {
                        setStatus('Payment failed');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setStatus('Error verifying payment');
                } finally {
                    setLoading(false);
                }
            }
        };

        verifyPayment();
    }, [reference, paymentSent]);

    const sendSelectedPlan = async () => {
        try {
            await axios.post('http://localhost:8080/api/paystack/record-payment', {
                email,
                plan,
                amount: parseFloat(amount || '0'), // Handle case where amount may be null
                reference,
            });
            setPaymentSent(true);
            alert('Payment information sent to the backend.');
        } catch (error) {
            console.error('Error sending payment information:', error);
        }
    };

    useEffect(() => {
        const redirectDelay = async () => {
            if (!loading && status) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                router.push('/'); // Redirect to the homepage after the delay
            }
        };

        redirectDelay();
    }, [loading, status, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="loader animate-spin border-8 border-t-8 border-blue-500 border-gray-300 rounded-full w-16 h-16 mb-4"></div>
                <p className="text-lg text-gray-700">Verifying payment...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-green-600">{status}</h1>
            <p className="mt-2 text-lg text-gray-700">Redirecting you to the homepage...</p>
        </div>
    );
};

// Parent component to manage search parameters and suspense
const PaymentCallbackWrapper = () => {
    const searchParams = new URLSearchParams(window.location.search); // Get URL search params directly from window
    const reference = searchParams.get('reference');
    const email = searchParams.get('email');
    const plan = searchParams.get('plan');
    const amount = searchParams.get('amount');

    return (
        <PaymentCallback
            reference={reference}
            email={email}
            plan={plan}
            amount={amount}
        />
    );
};

export default PaymentCallbackWrapper;
