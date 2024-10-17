import React from 'react';

type FoodItem = {
    name: string;
};

type MainItem = {
    name: string;
    price: number;
    description: string;
};

type ListDetailProps = {
    protein?: FoodItem[];
    sauce?: FoodItem[];
    extra?: FoodItem[];
    main: MainItem;
};

export default function ListDetail({ protein, sauce, extra, main }: ListDetailProps = {
    protein: [],
    sauce: [],
    extra: [],
    main: { name: 'Sample Meal', price: 10, description: 'Assorted fried rice with variety of flavour' }
}) {
    const options = [
        { title: ' Option - 1', items: protein },
        { title: 'Option - 2 ', items: sauce },
        { title: 'Option - 3', items: extra },
    ].filter(category => category.items && category.items.length > 0);

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-h-[80vh] flex flex-col">
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{main.name}</h2>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        ₵{main.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        {main.description}
                    </p>
                </div>

                {options.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 sticky top-0 bg-white dark:bg-gray-800 py-2">Available Options</h3>
                        {options.map((category, index) => (
                            <div key={index} className="space-y-2">
                                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">{category.title}</h4>
                                <ul className="list-disc list-inside pl-4 space-y-1">
                                    {category.items?.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}