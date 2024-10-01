'use client'
import React, {useEffect} from 'react';
import AgencyAccordion from "@/components/main/agency-accordion";

import useVendorStore from "@/app/store/vendor";

// Define the types for Agency and Vendor
interface Agency {
    _id: string;
    imageUrl: string;
    company: string;
    branch: string;
    users: any[]; // Replace 'any' with the actual type of users if known
}

interface Vendor {
    agencies: Agency[];
}

const Orders: React.FC = () => {
    const { vendor ,fetchVendor} = useVendorStore()
    const agencies: Agency[] = vendor?.agencies || [];  // Default to an empty array if vendor is undefined



    useEffect(() => {


                fetchVendor()


    }, [fetchVendor]);


    return (
        <div className={`w-[80vw] p-5 mx-auto`}>
            <h1 className={`font-bold text-4xl mb-4`}>Orders</h1>
            {agencies.length > 0 ? (
                <ul>
                    {agencies.map((agency) => (
                        <AgencyAccordion key={agency._id} agency={agency} vendor={vendor}  />
                    ))}
                </ul>
            ) : (
                <p>No agencies available.</p>
            )}
        </div>
    );
};

export default Orders;
