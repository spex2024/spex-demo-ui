'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useAuthStore from "@/store/authenticate";
import {useUserStore} from "@/store/profile";

const useAuth = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { setIsAuthenticated ,logout: clearAuth} = useAuthStore()
    const {  fetchUser } = useUserStore()
    // const baseurl = 'https://enterprise-backend.vercel.app';
    const baseurl = 'https://api.spexafrica.site';
    // const baseurl = 'http://localhost:8080';

    const login = async (data) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/login`, data, { withCredentials: true });
            if (response.status===200) {
                setSuccess(response?.data?.message);
                setIsAuthenticated(true)
                router.push('/')
            }
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/logout`, {}, { withCredentials: true });
            if (response.data.success) {
                setSuccess(response.data.message);
                clearAuth()
                router.push('/login'); // or any public route
            }
            setSuccess(response.data.message);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const createAgency = async (data) => {
        setError(null);
        console.log(data)
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/register`, data);
            console.log(response.data)
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

    const addVendor = async (data) => {
        setError(null);
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/add-vendor`, data ,{withCredentials: true });
            console.log(response.data)
            if (response.status===200) {
                setSuccess(response.data.message);

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
            const response = await axios.post(`${baseurl}/api/enterprise/request`, user);
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
            const response = await axios.post(`${baseurl}/api/enterprise/reset`, data);
            console.log(response.status);
            if (response.status === 200) {
                router.push('/sign-in')
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
            const response = await axios.post(`${baseurl}/api/enterprise/resend`, data);
            console.log(response);
            router.push('/sign-in')
            setSuccess(response.data.message)
            if (response.status===400){
                setError(response.data.message);
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    }
    const disConnectVendor = async (userId, vendorId) => {
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/vendor/disconnect`, {userId , vendorId});
            console.log(response);
            setSuccess(response.data.message)
            if (response.status===400){
                setError(response.data.message);
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : 'An error occurred');
        }
    }
    const disConnectUser = async (entId, userId) => {
        try {
            const response = await axios.post(`${baseurl}/api/enterprise/employee/disconnect`, {userId , entId});
            console.log(response);
            setSuccess(response.data.message)
            if (response.status===400){
                setError(response.data.message);
            }

        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        }
    }

    return {
        login,
        logout,
        createAgency,
        resetRequest,
        resetPassword,
        resendVerification,
        addVendor,
        disConnectVendor,
        disConnectUser,
        success,
        error,
    };
};

export default useAuth;
