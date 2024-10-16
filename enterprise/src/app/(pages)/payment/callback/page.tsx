'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const PaymentCallback = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // To get query parameters from the URL
    const reference = searchParams.get('reference'); // Get the payment reference from query params
    const email = searchParams.get('email'); // Get the email from query params
    const plan = searchParams.get('plan'); // Get the plan from query params
    const amount = searchParams.get('amount'); // Get the amount from query params
    const [loading, setLoading] = useState(true); // Initial loading state set to true
    const [status, setStatus] = useState<string | null>(null); // Specify type as string or null
    const [paymentSent, setPaymentSent] = useState(false); // New flag to prevent double submission
    const baseurl = 'https://api.spexafrica.app';
    // const baseurl = "http://localhost:8080";

    useEffect(() => {
        const verifyPayment = async () => {
            if (reference) {
                try {
                    const { data } = await axios.get(`${baseurl}/api/paystack/verify-payment/${reference}`);
                    console.log('Payment Verification Response:', data);

                    if (data.data.status === 'success') {
                        setStatus('Payment successful');
                        if (!paymentSent) {
                            // Ensure we send the payment info only once
                            await sendSelectedPlan();
                        }
                    } else {
                        setStatus('Payment failed');
                    }
                } catch (error) {
                    console.error('Payment verification error:', error);
                    setStatus('Error verifying payment');
                }
            }
        };

        // Delay the loading state for 5 seconds
        const loadingTimeout = setTimeout(async () => {
            await verifyPayment(); // Proceed with payment verification after the loading period
            setLoading(false); // Set loading to false after the 5-second delay
        }, 5000);

        return () => clearTimeout(loadingTimeout); // Clean up the timeout when component unmounts
    }, [reference, paymentSent]);

    const sendSelectedPlan = async () => {
        try {
            await axios.post(`${baseurl}/api/paystack/record-payment`, {
                email,
                plan,
                amount: parseFloat(amount || '0'), // Handle case where amount may be null
                reference,
            });
            setPaymentSent(true); // Set the flag to prevent double submission
        } catch (error) {
            console.error('Error sending payment information:', error);
        }
    };

    // Add a delay for redirection
    useEffect(() => {
        const redirectDelay = async () => {
            if (!loading && status) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Delay for 2 seconds
                router.push('/'); // Redirect to the homepage after the delay
            }
        };

        redirectDelay();
    }, [loading, status, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="loader animate-spin border-8 border-t-8 border-blue-500 rounded-full w-16 h-16 mb-4"></div>
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

// Wrap the PaymentCallback component with Suspense
const PaymentCallbackWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentCallback />
        </Suspense>
    );
};

export default PaymentCallbackWrapper;
