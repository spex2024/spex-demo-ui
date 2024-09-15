'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from "@/app/store/authenticate";

const useAuth = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const { setIsAuthenticated } = useAuthStore()
    const router = useRouter();
    // const baseurl = 'http://localhost:8080';
    // const baseurl = 'https://enterprise-backend.vercel.app';
    const baseurl = 'https://enterprise-backend-l6pn.onrender.com';

    const login = async (data) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/vendor/login`, data, { withCredentials: true });
            if (response.status===200) {
                setIsAuthenticated(true)
                router.push('/')
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/vendor/logout`, {}, { withCredentials: true });
            if (response.data.success) {
                setSuccess(response.data.message);
                setIsAuthenticated(false)
                router.push('/login'); // or any public route
            }
            setSuccess(response.data.message);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const addVendor = async (user) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/vendor/register`, user);
            console.log(response)
            if (response.status===200) {
                setSuccess(response.data.message);
                router.push('/login');

            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const resetRequest = async (user) => {
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post(`${baseurl}/api/vendor/request`, user);
            if (response.status === 200) {
                setSuccess(response.data.message);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const resetPassword = async (user, token) => {
        const data = {token ,...user}
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/vendor/reset`, data);
            console.log(response.status);
            if (response.status === 200) {
                router.push('/login')
                setSuccess(response.data.message);

            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const resendVerification = async (data) => {
        try {
            const response = await axios.post(`${baseurl}/api/vendor/resend`, data);
            console.log(response);
            router.push('/login')
            setSuccess(response.data.message)
            if (response.status===400){
                setError(response.data.message);
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    }

    return {
        login,
        logout,
        addVendor,
        resetRequest,
        resetPassword,
        resendVerification,
        success,
        error,
    };
};

export default useAuth;
