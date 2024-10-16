"use client"

import React, {useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { UserCircle, Info, FileText, LifeBuoy, Loader2, Check, Camera } from "lucide-react"

import ProfileTab from "@/components/page/profile";
import {useUserStore} from "@/store/profile";
import {useRouter} from "next/navigation";
import {ClimbingBoxLoader} from "react-spinners";
interface User {
    packs?: number;
    subscription?: string;
    isActive?: boolean;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}


const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'about', label: 'About', icon: Info },
    { id: 'policy', label: 'Policy', icon: FileText },
    { id: 'support', label: 'Support', icon: LifeBuoy },
]



export default function AdvancedStylishProfile() {
    const [activeTab, setActiveTab] = useState(tabs[0].id)


    const { user, fetchUser } = useUserStore() as UserStore;
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            await fetchUser();

            // Wait for an additional 5 seconds after fetching user data
            setTimeout(() => {
                setLoading(false); // Set loading to false after 5 seconds
            },2000);
        };

        loadUser();
    }, [fetchUser]);

    if (loading) {
        // Show a loading indicator for 5 seconds
        return (
            <div className="flex items-center justify-center h-screen">
                <ClimbingBoxLoader color="#71bc44" size={20} />
            </div>
        );
    }

    if (user?.isActive === false) {
        router.push('/');
    }

    const renderProfileContent = () => (
        <div className="space-y-6">
           <ProfileTab/>
        </div>
    )

    const renderAboutContent = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Our Application</h3>
            <p>Welcome to our cutting-edge profile management system. We have designed this platform with you in mind, focusing on user experience and powerful customization options.</p>
            <p>Our mission is to provide you with the tools you need to express yourself and manage your online presence effectively.</p>
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1">
                    <li>Customizable user profiles</li>
                    <li>Real-time updates and notifications</li>
                    <li>Advanced privacy controls</li>
                    <li>Integration with popular social platforms</li>
                </ul>
            </div>
        </div>
    )

    const renderPolicyContent = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Policy</h3>
            <p>We take your privacy seriously. Our policy ensures that your personal information is protected and used only for the purposes you have consented to.</p>
            <h3 className="text-lg font-semibold mt-4">Terms of Service</h3>
            <p>By using our service, you agree to abide by our terms of service. These terms are designed to create a safe and respectful environment for all users.</p>
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Key Points:</h4>
                <ul className="list-disc list-inside space-y-1">
                    <li>We never sell your personal data</li>
                    <li>You have full control over your data and can request its deletion at any time</li>
                    <li>We use industry-standard security measures to protect your information</li>
                    <li>Our service is GDPR and CCPA compliant</li>
                </ul>
            </div>
        </div>
    )

    const renderSupportContent = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Need Help?</h3>
            <p>Our support team is here to assist you with any questions or issues you may encounter.</p>
            <div className="bg-muted p-4 rounded-md">
                <p><strong>Email:</strong> support@example.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Hours:</strong> Monday - Friday, 9am - 5pm EST</p>
            </div>
            <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Frequently Asked Questions:</h4>
                <ul className="space-y-2">
                    <li>
                        <strong>Q: How do I reset my password?</strong>
                        <p>A: Click on the <i>Forgot Password</i> link on the login page and follow the instructions sent to your email.</p>
                    </li>
                    <li>
                        <strong>Q: Can I change my username?</strong>
                        <p>A: Yes, you can change your username in the Profile settings once every 30 days.</p>
                    </li>
                </ul>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-6xl mx-auto">
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-3xl font-bold">Settings</h2>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList>
                                    {tabs.map((tab) => (
                                        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                                            <tab.icon className="h-4 w-4" />
                                            <span>{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="min-h-[400px]"
                            >

                                    <>
                                        {activeTab === 'profile' && renderProfileContent()}
                                        {activeTab === 'about' && renderAboutContent()}
                                        {activeTab === 'policy' && renderPolicyContent()}
                                        {activeTab === 'support' && renderSupportContent()}
                                    </>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}