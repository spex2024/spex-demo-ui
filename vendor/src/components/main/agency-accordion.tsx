import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import OrderTable from "@/components/main/order-table";

// Define TypeScript interface for props
interface Agency {
    _id: string;
    imageUrl: string;
    company: string;
    branch: string;
    users: any[]; // Replace 'any' with the actual type of users if known
}

interface AgencyAccordionProps {
    agency: Agency;
}

const AgencyAccordion: React.FC<AgencyAccordionProps> = ({ agency }) => {
    const { users } = agency;


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
                    <OrderTable user={users} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default AgencyAccordion;
