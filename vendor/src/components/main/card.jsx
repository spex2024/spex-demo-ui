'use client'

import React, { useEffect } from 'react';
import useMealsStore from "@/app/store/meal";
import useDrawerStore from "@/app/store/select";
import useCartStore from "@/app/store/CartContext";


const Meal =  () => {
    const { meals, fetchMeals, selectedMeal, openModal, closeModal, handleOptionChange } = useMealsStore();
    const { cart, addToCart, removeFromCart, totalPrice } = useCartStore();
    const { isDrawerOpen, toggleDrawer } = useDrawerStore();

    useEffect(() => {
        fetchMeals(); // Fetch meals when the component mounts
    }, [fetchMeals]);

    const handleAddToCart = () => {
        addToCart();
        closeModal();
    };

    return (
        <div>
            <button onClick={toggleDrawer}>
                {isDrawerOpen ? 'Close Drawer' : 'Open Drawer'}
            </button>

            {isDrawerOpen && (
                <div className="drawer">
                    <h2>Cart</h2>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index}>
                                {item.main} - ${item.price}
                                <button onClick={() => removeFromCart(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div>Total Price: ${totalPrice}</div>
                    <button onClick={() => checkout()}>Checkout</button>
                </div>
            )}

            <div>
                <h1>Meals</h1>
                {meals.map((meal) => (
                    <div key={meal._id}>
                        <h2>{meal.main.name}</h2>
                        <button onClick={() => openModal(meal)}>Select Meal</button>
                    </div>
                ))}

                {selectedMeal && (
                    <div className="modal">
                        <h2>{selectedMeal.main.name}</h2>
                        {/* Assume options are available for the selected meal */}
                        <label>
                            Protein:
                            <select onChange={(e) => handleOptionChange('protein', e.target.value)}>
                                <option value="">Select</option>
                                {/* Add options dynamically here */}
                            </select>
                        </label>
                        <label>
                            Sauce:
                            <select onChange={(e) => handleOptionChange('sauce', e.target.value)}>
                                <option value="">Select</option>
                                {/* Add options dynamically here */}
                            </select>
                        </label>
                        {/* Add other options similarly */}
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <button onClick={closeModal}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meal;
