'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const useAuth = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state
    const router = useRouter();
    // const baseurl = 'http://localhost:8080';
    const baseurl = 'https://api.spexafrica.app';


    const handleRequest = async (request) => {
        setLoading(true);
        setError(null);
        try {
            const response = await request();
            if (response.status === 200) {
                setSuccess(response.data.message);
                window.location.reload();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/login`, data, { withCredentials: true }));
        if (success) router.push('/ent-dashboard');
    };

    const logout = async () => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/logout`, {}, { withCredentials: true }));
        if (success) router.push('/login');
    };

    const createAgency = async (data) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/register`, data));
        if (success) router.push('/login');
    };

    const addVendor = async (data) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/add-vendor`, data, { withCredentials: true }));
    };

    const resetRequest = async (user) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/request`, user));
    };

    const resetPassword = async (user, token) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/reset`, { token, ...user }));
        if (success) router.push('/sign-in');
    };

    const resendVerification = async (data) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/resend`, data));
        if (success) router.push('/sign-in');
    };

    const disConnectVendor = async (userId, vendorId) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/vendor/disconnect`, { userId, vendorId }));
    };

    const disConnectUser = async (entId, userId) => {
        await handleRequest(() => axios.post(`${baseurl}/api/enterprise/employee/disconnect`, { userId, entId }));
    };

    const updateEnterprise = async (entId, userData) => {
        await handleRequest(() =>
            axios.put(`${baseurl}/api/enterprise/update/${entId}`, userData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
        );

    };

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
        updateEnterprise,

        success,
        error,
        loading, // Expose loading state
    };
};

export default useAuth;
