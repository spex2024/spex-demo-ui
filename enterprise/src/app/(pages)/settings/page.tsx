"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Info, FileText, LifeBuoy } from "lucide-react"
import ProfileTab from "@/components/page/profile"

const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'about', label: 'About', icon: Info },
    { id: 'policy', label: 'Policy', icon: FileText },
    { id: 'support', label: 'Support', icon: LifeBuoy },
]

export default function HorizontalScrollTabsProfile() {
    const [activeTab, setActiveTab] = useState(tabs[0].id)
    const tabsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tabsElement = tabsRef.current
        if (tabsElement) {
            const activeTabElement = tabsElement.querySelector('[data-state="active"]')
            if (activeTabElement) {
                activeTabElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                })
            }
        }
    }, [activeTab])

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
                <address className="not-italic text-xs">
                    <p>No. 5 Paterson Ave, Ritz, Adenta - Accra</p>
                    <p className="mt-2">Phone: +233 302 515 422</p>
                    <p>Email: hello@spexafrica.app</p>
                </address>
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
        <div className="container mx-auto py-6 px-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-bold">Settings</h2>
                            <div className="overflow-x-auto pb-2" ref={tabsRef}>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-auto">
                                        {tabs.map((tab) => (
                                            <TabsTrigger
                                                key={tab.id}
                                                value={tab.id}
                                                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                                            >
                                                <tab.icon className="h-4 w-4 mr-2" />
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
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
                                {activeTab === 'profile' && renderProfileContent()}
                                {activeTab === 'about' && renderAboutContent()}
                                {activeTab === 'policy' && renderPolicyContent()}
                                {activeTab === 'support' && renderSupportContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}