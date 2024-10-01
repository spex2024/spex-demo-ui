import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import OrderTable from "@/components/main/order-table";

// Define TypeScript interface for the order structure
interface Order {
    orderId: string;
    status: string;
    createdAt: string;
    meals: {
        mealId: string;
        price: number;
        main: string;
    }[];
    orderedBy: string;
    imageUrl: string;
    quantity: number;
    user: {
        firstName: string;
        lastName: string;
    };
    vendor: {
        name: string;
    };
}

// Define TypeScript interface for props
interface Agency {
    _id: string;
    imageUrl: string;
    company: string;
    branch: string;
    users: {
        firstName: string;
        lastName: string;
        orders: Order[];
    }[];
}

interface Vendor {
    _id: string;
    name: string;
}

interface AgencyAccordionProps {
    agency: Agency;
    vendor: Vendor; // Include vendor prop
}

const AgencyAccordion: React.FC<AgencyAccordionProps> = ({ agency, vendor }) => {
    const { users } = agency;

    // Ensure users have orders and filter by vendor ID
    const orders = users.flatMap(user =>
        user.orders?.filter(order => order.vendor.name === vendor.name) || []
    );

    console.log(orders);

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={agency._id}>
                <AccordionTrigger>
                    <div className="flex items-center justify-center gap-3">
                        <img src={agency.imageUrl} alt="agency" className="h-15 w-10" />
                        <p>{agency.company} <span className={`text-sm text-gray-500`}>({agency.branch})</span></p>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <OrderTable orders={orders} /> {/* Pass filtered orders to OrderTable */}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default AgencyAccordion;
