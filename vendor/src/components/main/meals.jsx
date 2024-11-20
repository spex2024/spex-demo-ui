'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSelectedMeal } from '@/app/store/select';
import { useMeals } from '@/app/store/meal';
import MealModal from '@/components/main/modal';
import ProductCard from "@/components/main/product card";

const MealList = () => {
    const { meals } = useMeals();
    const { openModal } = useSelectedMeal();

    return (
        <div className="w-full min-h-screen p-4 flex flex-wrap gap-4">
            <div className="flex p-10 w-full bg-slate-400 h-screen gap-5">
                {meals?.map((meal) => (
                    <div key={meal._id}
                         className="w-64 h-64 flex flex-col items-center justify-around shadow-sm bg-white rounded p-4">

                        <h1>{meal.mealName} - ${meal.price}</h1>
                        <Button onClick={() => openModal(meal)}>Customize</Button>
                    </div>
                ))}
            </div>
            <MealModal/>
            <ProductCard/>
        </div>
    );
};

export default MealList;
