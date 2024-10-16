"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OneTime from "@/components/page/one-time";
import CustomPlan from "@/components/page/custom";



const Plans = () => {
    return (
        <div className="w-full mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Enterprise Pricing Plans</h1>

            <Tabs defaultValue="one-time" className="w-full max-w-6xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="one-time">One Time Plan</TabsTrigger>
                    <TabsTrigger value="three-month">3 Month Plan</TabsTrigger>
                    <TabsTrigger value="custom">Custom Plan</TabsTrigger>
                </TabsList>
                <TabsContent value="one-time">
                    <OneTime/>
                </TabsContent>
                <TabsContent value="three-month">

                </TabsContent>
                <TabsContent value="custom">
                    <CustomPlan />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Plans