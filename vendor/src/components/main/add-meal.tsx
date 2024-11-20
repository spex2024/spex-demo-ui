'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UploadCloud, Utensils, Check, Trash2, Plus } from "lucide-react"
import axios from "axios"
import { toast } from 'react-hot-toast'

interface MealFormState {
    mealName: string
    description: string
    daysAvailable: string[]
    price: string
    protein: string[]
    sauce: string[]
    extras: string[]
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function MealForm() {
    const initialMealState: MealFormState = {
        mealName: '',
        description: '',
        daysAvailable: [],
        price: '',
        protein: [],
        sauce: [],
        extras: [],
    }

    const [meal, setMeal] = useState<MealFormState>(initialMealState)
    const [file, setFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const baseurl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : (typeof window !== 'undefined' && window.location.hostname.endsWith('.site'))
            ? 'https://api.spexafrica.site'
            : 'https://api.spexafrica.app'

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setMeal(prevMeal => ({
            ...prevMeal,
            [name]: value,
        }))
    }

    const handleDaysChange = (day: string) => {
        setMeal(prevMeal => {
            const updatedDays = prevMeal.daysAvailable.includes(day)
                ? prevMeal.daysAvailable.filter(d => d !== day)
                : [...prevMeal.daysAvailable, day]
            return { ...prevMeal, daysAvailable: updatedDays }
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setFilePreview(URL.createObjectURL(selectedFile))
        }
    }

    const handleOptionChange = (index: React.Key | null | undefined, type: "protein" | "sauce" | "extras", value: string) => {
        setMeal(prevMeal => ({
            ...prevMeal,
            [type]: prevMeal[type].map((item, i) => i === index ? value : item)
        }))
    }

    const addOption = (type: 'protein' | 'sauce' | 'extras') => {
        setMeal(prevMeal => ({
            ...prevMeal,
            [type]: [...prevMeal[type], '']
        }))
    }

    const removeOption = (index: React.Key | null | undefined, type: "protein" | "sauce" | "extras") => {
        setMeal(prevMeal => ({
            ...prevMeal,
            [type]: prevMeal[type].filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('mealName', meal.mealName)
        formData.append('description', meal.description)
        formData.append('daysAvailable', JSON.stringify(meal.daysAvailable))
        formData.append('price', meal.price)
        formData.append('protein', JSON.stringify(meal.protein))
        formData.append('sauce', JSON.stringify(meal.sauce))
        formData.append('extras', JSON.stringify(meal.extras))

        if (file) {
            formData.append('image', file)
        }

        try {
            const response = await axios.post(`${baseurl}/api/vendor/add-meal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            })
            console.log(response.data)
            toast.success('Meal created successfully')
            setMeal(initialMealState)
            setFile(null)
            setFilePreview(null)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || 'Failed to add meal')
            } else {
                toast.error('An unexpected error occurred')
            }
            console.error('Failed to add meal:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-[#71bc44]">
            <CardHeader className="bg-gradient-to-r from-[#e8f5e9] to-[#f9f5d7]">
                <CardTitle className="text-2xl font-bold text-[#71bc44]">Add New Meal</CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="mealName" className="text-[#71bc44]">Meal Name</Label>
                        <Input
                            id="mealName"
                            name="mealName"
                            placeholder="Enter meal name"
                            value={meal.mealName}
                            onChange={handleChange}
                            required
                            className="border-[#71bc44] focus-visible:ring-[#71bc44]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-[#c7b72f]">Price (GHS)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c7b72f]">₵</span>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={meal.price}
                                onChange={handleChange}
                                className="pl-8 border-[#c7b72f] focus-visible:ring-[#c7b72f]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[#71bc44]">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the meal"
                            value={meal.description}
                            onChange={handleChange}
                            required
                            className="border-[#71bc44] focus-visible:ring-[#71bc44]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#c7b72f]">Days Available</Label>
                        <div className="flex flex-wrap gap-4">
                            {daysOfWeek.map((day) => (
                                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={meal.daysAvailable.includes(day)}
                                            onChange={() => handleDaysChange(day)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-[#c7b72f] peer-checked:bg-[#c7b72f] transition-colors duration-200" />
                                        <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                                    </div>
                                    <span className={`select-none transition-colors duration-200 ${
                                        meal.daysAvailable.includes(day) ? 'text-[#c7b72f]' : 'text-gray-700'
                                    }`}>
                    {day}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {['protein', 'sauce', 'extras'].map((type) => (
                        <div key={type} className="space-y-4">
                            <Label className="text-[#71bc44] text-lg font-semibold">
                                {type.charAt(0).toUpperCase() + type.slice(1)} Options
                            </Label>
                            <div className="bg-gradient-to-r from-[#e8f5e9] to-[#f9f5d7] p-4 rounded-lg">
                                {(meal[type as keyof typeof meal] as string[]).map((option: string, index: number) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <Input
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, type as 'protein' | 'sauce' | 'extras', e.target.value)}
                                            placeholder={`Enter ${type} option`}
                                            className="flex-grow border-[#c7b72f] focus-visible:ring-[#c7b72f]"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeOption(index, type as 'protein' | 'sauce' | 'extras')}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(type as 'protein' | 'sauce' | 'extras')}
                                    className="mt-2 border-[#71bc44] text-[#71bc44] hover:bg-[#71bc44] hover:text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add {type} option
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label htmlFor="image" className="text-[#71bc44]">Meal Image</Label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="image"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gradient-to-r from-[#e8f5e9] to-[#f9f5d7] hover:from-[#d4edda] hover:to-[#f5f0d1] transition-colors duration-300"
                            >
                                {filePreview ? (
                                    <img src={filePreview} alt="Meal Preview" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-[#71bc44]" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                )}
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#71bc44] to-[#c7b72f] hover:from-[#5da438] hover:to-[#b3a429] text-white transition-colors duration-300"
                        disabled={isSubmitting}
                    >
                        <Utensils className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Adding Meal...' : 'Add Meal'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}