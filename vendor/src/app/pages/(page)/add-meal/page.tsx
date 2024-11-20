'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils } from "lucide-react"
import MealForm from "@/components/main/add-meal"

export default function AddMeal() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-5xl mx-auto border-none bg-transparent">
                <CardHeader className="space-y-6">
                    <div className="flex items-center justify-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                            <Utensils className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle className="text-4xl font-bold tracking-tight">Add Meal</CardTitle>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Expand your culinary collection by adding a new delicious meal. Fill in the details below to get started.
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="mt-10">
                    <MealForm />
                </CardContent>
            </Card>
            <footer className="mt-12 text-center text-sm text-muted-foreground">
                <p>
                    Need assistance? Check our <a href="#" className="font-medium text-primary hover:underline">FAQ</a> or <a href="#" className="font-medium text-primary hover:underline">contact our support team</a>.
                </p>
            </footer>
        </div>
    )
}