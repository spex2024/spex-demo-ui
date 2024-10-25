"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"
import OneTime from "@/components/page/one-time"
import CustomPlan from "@/components/page/custom"
import ThreeMonths from "@/components/page/3-months"
import SixMonths from "@/components/page/6-month"
import useAuth from "@/hook/auth"
import { toast } from "react-hot-toast"

export default function Plans() {
    const { logout, success, error } = useAuth()

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="w-full mx-auto min-h-screen px-4 py-8 bg-gradient-to-b from-background to-[#71bc44]/10 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <Button asChild variant="ghost" className="w-full sm:w-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 w-full sm:w-auto">
                    <LogOut size={16} />
                    Logout
                </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-[#71bc44]">Enterprise Pricing Plans</h1>

            <Tabs defaultValue="one-time" className="w-full max-w-7xl mx-auto">
                <div className="overflow-x-auto pb-4">
                    <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-4 mb-8">
                        <TabsTrigger value="one-time" className="px-4 py-2 whitespace-nowrap">One Time Plan</TabsTrigger>
                        <TabsTrigger value="three-month" className="px-4 py-2 whitespace-nowrap">3 Months Plan</TabsTrigger>
                        <TabsTrigger value="six-month" className="px-4 py-2 whitespace-nowrap">6 Months Plan</TabsTrigger>
                        <TabsTrigger value="custom" className="px-4 py-2 whitespace-nowrap">Custom Plan</TabsTrigger>
                    </TabsList>
                </div>
                <div className="overflow-x-auto">
                    <TabsContent value="one-time">
                        <OneTime />
                    </TabsContent>
                    <TabsContent value="three-month">
                        <ThreeMonths />
                    </TabsContent>
                    <TabsContent value="six-month">
                        <SixMonths />
                    </TabsContent>
                    <TabsContent value="custom">
                        <CustomPlan />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}