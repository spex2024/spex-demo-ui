import React from 'react';

type FoodItem = {
    name: string;
};

type MainItem = {
    name: string;
    price: number;
};

type ListDetailProps = {
    protein?: FoodItem[];
    sauce?: FoodItem[];
    extra?: FoodItem[];
    main: MainItem;
};

const ListDetail: React.FC<ListDetailProps> = ({ protein, sauce, extra, main }) => {
    return (
        <div className={`bg-slate-400 w-[80%]`}>
            <div className="w-full space-y-2 bg-white py-10 mx-auto rounded-lg flex flex-col items-start text-start ">
                <dl className="flex flex-col sm:flex-row ">
                    <dt className="min-w-20">
                        <span className="block text-sm text-gray-900 dark:text-neutral-500 font-bold">Main:</span>
                    </dt>
                    <dd>
                        <ul>
                            <li className="flex flex-col items-center text-xs text-gray-800 dark:text-neutral-200">
                                {main.name}
                            </li>
                        </ul>
                    </dd>
                </dl>
                <dl className="flex flex-col sm:flex-row ">
                    <dt className="min-w-20">
                        <span className="block text-sm text-gray-900 dark:text-neutral-500 font-bold">Price:</span>
                    </dt>
                    <dd>
                        <ul>
                            <li className="inline-flex text-xs items-center  text-gray-800 dark:text-neutral-200 gap-x-2">
                                ₵<p>{main.price}.00</p>
                            </li>
                        </ul>
                    </dd>
                </dl>

                    <dl className="flex flex-col lg:flex-row  gap-x-1" >
                        <dt className="min-w-20">
                            <span className="block text-sm text-gray-900 dark:text-neutral-500 font-bold">Protein:</span>
                        </dt>
                        {protein?.map((proteinItem) => (
                        <dd key={proteinItem.name} className={`min-w-20`}>
                            <ul>
                                <li className="w-full flex  items-center text-xs text-gray-800 dark:text-neutral-200">
                                    {proteinItem.name}
                                </li>
                            </ul>
                        </dd>
                        ))}
                    </dl>


                    <dl className="w-full flex-col lg:flex-row  gap-x-1" >
                        <dt className="min-w-20">
                            <span className="block text-sm text-gray-900 dark:text-neutral-500 font-bold">Sauce:</span>
                        </dt>
                        {sauce?.map((sauceItem) => (
                        <dd  key={sauceItem.name} className={`min-w-20`}>
                            <ul className={`w-full text-center`}>
                                <li className="w-full flex items-center text-xs text-gray-800 dark:text-neutral-200">
                                    {sauceItem.name}
                                </li>
                            </ul>
                        </dd>
                        ))}
                    </dl>


                    <dl className="w-full flex-col lg:flex-row    gap-x-1  " >
                        <dt className="min-w-20">
                            <span className="block text-sm text-gray-900 font-bold dark:text-neutral-500">Extra:</span>
                        </dt>
                        {extra?.map((extraItem) => (
                        <dd key={extraItem.name} className={``}>
                            <ul className={`w-full text-center `}>
                                <li className="w-full flex  items-center justify-center h-full text-xs text-gray-800 dark:text-neutral-200 ">
                                    {extraItem.name}
                                </li>
                            </ul>
                        </dd>
                        ))}
                    </dl>

            </div>
        </div>
    );
};

export default ListDetail;
