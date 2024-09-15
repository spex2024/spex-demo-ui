'use client'

import React, { useState, FormEvent } from 'react';
import ListDetail from "@/components/main/list";

interface ModalProps {
    mealDetail: any; // You should define the type according to your mealDetail structure
    setSelectedMeal: (meal: any | null) => void;
    image : any;
    name: string;
}

const Modal: React.FC<ModalProps> = ({ mealDetail, setSelectedMeal , image, name }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const {protein, sauce , extras , main}= mealDetail

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setSelectedMeal(null);
        // Handle form submission logic here
    };



    if (!isOpen) return null;

    return (
        <div className="text-center">
            <div
                id="hs-ai-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto"
                role="dialog"
                tabIndex={-1}
                aria-labelledby="hs-ai-modal-label"
                aria-modal="true"
            >
                <div className="relative w-full lg:max-w-3xl bg-white rounded-lg shadow-xl dark:bg-neutral-800">
                    <div
                        className="relative  overflow-hidden min-h-72 bg-gray-900 bg-cover bg-center text-center rounded-t-lg dark:bg-neutral-950"
                        style={{backgroundImage: `url(${mealDetail.imageUrl})`}}>
                        <div className="absolute top-2 right-2">
                            <button
                                type="button"
                                className="w-8 h-8 inline-flex  justify-center items-center rounded-full border border-transparent bg-black text-white hover:bg-white/20 focus:outline-none focus:bg-white/20"
                                aria-label="Close"
                                onClick={() => setSelectedMeal(null)}
                            >
                                <span className="sr-only">Close</span>
                                <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6L6 18"/>
                                    <path d="M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <figure className="absolute inset-x-0 bottom-0 -mb-px">
                            <svg
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1920 100.1"
                            >
                                <path
                                    fill="currentColor"
                                    className="fill-white dark:fill-neutral-800"
                                    d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                                ></path>
                            </svg>
                        </figure>
                    </div>

                    <div className="relative z-10 -mt-12">
            <span
                className="mx-auto flex justify-center items-center w-16 h-16 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 bg-center bg-cover"
                style={{backgroundImage: `url(${image})`}}>

            </span>
                    </div>


                    <div className=" w-full  sm:p-7  flex flex-col items-center justify-center">
                        <h1 className={`font-bold text-xl`}>{name}</h1>

                        <ListDetail protein={protein} sauce={sauce} extra={extras} main={main}/>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
