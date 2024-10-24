"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OneTime from "@/components/page/one-time"
import CustomPlan from "@/components/page/custom"
import ThreeMonths from "@/components/page/3-months"
import SixMonths from "@/components/page/6-month"

const Plans = () => {
    return (
        <div className="w-full mx-auto min-h-screen px-4 py-8 bg-gradient-to-b from-background to-[#71bc44]/10">
            <h1 className="text-4xl font-bold text-center mb-12 text-[#71bc44]">Enterprise Pricing Plans</h1>

            <Tabs defaultValue="one-time" className="w-full max-w-7xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="one-time" className="px-4 py-2">One Time Plan</TabsTrigger>
                    <TabsTrigger value="three-month" className="px-4 py-2">3 Months Plan</TabsTrigger>
                    <TabsTrigger value="six-month" className="px-4 py-2">6 Months Plan</TabsTrigger>
                    <TabsTrigger value="custom" className="px-4 py-2">Custom Plan</TabsTrigger>
                </TabsList>
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
            </Tabs>
        </div>
    )
}

export default Plans