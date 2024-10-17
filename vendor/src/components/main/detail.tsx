'use client'

import React, { useState, FormEvent } from 'react'
import ListDetail from "@/components/main/list"
import { X } from "lucide-react"

interface ModalProps {
    mealDetail: any
    setSelectedMeal: (meal: any | null) => void
    image: string
    name: string
}

export default function MealDetails({ mealDetail, setSelectedMeal, image, name }: ModalProps = {
    mealDetail: {},
    setSelectedMeal: () => {},
    image: '',
    name: 'Sample Meal'
}) {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const { protein, sauce, extras, main } = mealDetail

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        setSelectedMeal(null)
    }

    const handleClose = () => {
        setIsOpen(false)
        setSelectedMeal(null)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="relative h-40 bg-gradient-to-b from-green-500 to-green-300"  style={{ backgroundImage: `url(${mealDetail.imageUrl})`,backgroundSize:"cover", backgroundRepeat:"no-repeat", backgroundPosition:"center" }}>
                    <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white shadow-lg bg-center bg-cover"
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                </div>

                <div className="px-4 pt-16 pb-4 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                    <div className="text-sm text-gray-500 mb-4">Delicious and nutritious!</div>
                </div>

                <div className="px-4 pb-4 max-h-60 overflow-y-auto">
                    <div className="bg-green-50 rounded-lg p-4">
                        <ListDetail protein={protein} sauce={sauce} extra={extras} main={main} />
                    </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}