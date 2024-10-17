'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import axios from "axios";

interface MealOption {
    option: string;
}

interface MainMeal {
    name: string;
    price: string;
    description: string;
}

interface MealFormState {
    main: MainMeal;
    protein: MealOption[];
    sauce: MealOption[];
    extras: MealOption[];
}

const AddMealForm= () => {
    const initialMainMeal: MainMeal = {
        name: '',
        price: '',
        description: '',
    };

    const initialOptionsState: MealOption = { option: '' };

    const initialMealState: MealFormState = {
        main: initialMainMeal,
        protein: [initialOptionsState],
        sauce: [initialOptionsState],
        extras: [initialOptionsState],
    };

    const [meal, setMeal] = useState<MealFormState>(initialMealState);
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const optionsStyle = "flex flex-col gap-5 mb-5";
    const mealStyle = "flex flex-col gap-5";
    const buttonDel = "flex items-center justify-start gap-1 bg-red-500 rounded-none";
    const buttonStyle = "w-full md:w-1/3 rounded-none";
    const buttonMain = "w-full md:w-1/3 rounded-none mt-5 bg-transparent border border-black text-black hover:bg-black hover:text-white py-7 text-xl";
    const baseurl = 'https://api.spexafrica.app';
    // const baseurl = 'http://localhost:8080';
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMeal(prevMeal => ({
            ...prevMeal,
            main: {
                ...prevMeal.main,
                [name]: value,
            }
        }));
    };

    const handleOptionChange = (index: number, type: 'protein' | 'sauce' | 'extras', value: string) => {
        setMeal(prevMeal => {
            const newOptions = [...prevMeal[type]];
            newOptions[index] = { option: value };
            return {
                ...prevMeal,
                [type]: newOptions as MealOption[],
            };
        });
    };

    const addOption = (type: 'protein' | 'sauce' | 'extras') => {
        setMeal(prevMeal => ({
            ...prevMeal,
            [type]: [...prevMeal[type], initialOptionsState]
        }));
    };

    const removeOption = (index: number, type: 'protein' | 'sauce' | 'extras') => {
        setMeal(prevMeal => {
            const newOptions = [...prevMeal[type]];
            newOptions.splice(index, 1);
            return {
                ...prevMeal,
                [type]: newOptions as MealOption[],
            };
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile)); // Create a preview URL for the selected file
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('main', JSON.stringify(meal.main));
        formData.append('protein', JSON.stringify(meal.protein));
        formData.append('sauce', JSON.stringify(meal.sauce));
        formData.append('extras', JSON.stringify(meal.extras));
        if (file) {
            formData.append('image', file); // Change field name to 'image'
        }

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const response = await axios.post(`${baseurl}/api/vendor/add-meal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials:true
            } );
            console.log(response.data);
            setMeal(initialMealState); // Reset the form fields
            setFile(null); // Reset the file input
            setFilePreview(null); // Reset the image preview
        } catch (error) {
            console.error('Failed to add meal:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 md:w-3/4 sm:w-full mx-auto flex flex-col gap-10 p-4 min-h-screen">

            {/* Main Meal Inputs */}
            <Input
                type="text"
                name="name"
                placeholder="Main Meal Name"
                value={meal.main.name}
                onChange={handleChange}
                className="w-full"
            />
            <Input
                type="text"
                name="price"
                placeholder="Main Meal Price"
                value={meal.main.price}
                onChange={handleChange}
                className="w-full"
            />
            <Input
                type="text"
                name="description"
                placeholder="Description"
                value={meal.main.description}
                onChange={handleChange}
                className="w-full"
            />

            {/* Protein Options */}
            <div className={mealStyle}>
                <h3>Option-One</h3>
                {meal.protein.map((option, index) => (
                    <div key={index} className={optionsStyle}>
                        <div className="flex items-center justify-between gap-3">
                            <Input
                                type="text"
                                placeholder="Protein Option"
                                value={option.option}
                                onChange={(e) => handleOptionChange(index, 'protein', e.target.value)}
                                className="w-full"
                            />
                            <Button type="button" className={buttonDel} onClick={() => removeOption(index, 'protein')}>
                                Remove<Trash2 color="#f4f0f0" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button type="button" className={buttonStyle} onClick={() => addOption('protein')}>
                    Add Option
                </Button>
            </div>

            {/* Sauce Options */}
            <div className={mealStyle}>
                <h3>Option - Two</h3>
                {meal.sauce.map((option, index) => (
                    <div key={index} className={optionsStyle}>
                        <div className="flex items-center justify-between gap-3">
                            <Input
                                type="text"
                                placeholder="Sauce Option"
                                value={option.option}
                                onChange={(e) => handleOptionChange(index, 'sauce', e.target.value)}
                                className="w-full"
                            />
                            <Button type="button" className={buttonDel} onClick={() => removeOption(index, 'sauce')}>
                                Remove <Trash2 color="#f4f0f0" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button type="button" className={buttonStyle} onClick={() => addOption('sauce')}>
                    Add  Option
                </Button>
            </div>

            {/* Extras Options */}
            <div className={mealStyle}>
                <h3>Option-Three</h3>
                {meal.extras.map((option, index) => (
                    <div key={index} className={optionsStyle}>
                        <div className="flex items-center justify-between gap-3">
                            <Input
                                type="text"
                                placeholder="Extras Option"
                                value={option.option}
                                onChange={(e) => handleOptionChange(index, 'extras', e.target.value)}
                                className="w-full"
                            />
                            <Button type="button" className={buttonDel} onClick={() => removeOption(index, 'extras')}>
                                Remove<Trash2 color="#f4f0f0" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button type="button" className={buttonStyle} onClick={() => addOption('extras')}>
                    Add  Option
                </Button>
            </div>

            {/* File Upload Input */}
            <label htmlFor="uploadFile1"
                   className="bg-white text-center rounded w-full min-h-[280px] py-4 px-4 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-900 mx-auto text-sm font-mono font-light">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 mb-3 fill-gray-400" viewBox="0 0 24 24">
                    <path
                        d="M22 13a1 1 0 0 0-1 1v4.213A2.79 2.79 0 0 1 18.213 21H5.787A2.79 2.79 0 0 1 3 18.213V14a1 1 0 0 0-2 0v4.213A4.792 4.792 0 0 0 5.787 23h12.426A4.792 4.792 0 0 0 23 18.213V14a1 1 0 0 0-1-1Z"
                        data-original="#000000" />
                    <path
                        d="M6.707 8.707 11 4.414V17a1 1 0 0 0 2 0V4.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-6-6a1 1 0 0 0-1.414 0l-6 6a1 1 0 1 0 1.414 1.414Z"
                        data-original="#000000" />
                </svg>
                {filePreview ? (
                    <img src={filePreview} alt="Selected file preview" className="max-w-full max-h-44 object-cover mb-3 mt-4 rounded border border-gray-400" />
                ) : (
                    <strong className="text-gray-400 font-light">
                        Drop images here or click to upload
                    </strong>
                )}
                <input type="file" onChange={handleFileChange} name="uploadFile1" id="uploadFile1" className="hidden"/>
            </label>

            {/* Submit Button */}
            <Button type="submit" className={buttonMain}>
                Submit Meal
            </Button>
        </form>
    );
};

export default AddMealForm;
