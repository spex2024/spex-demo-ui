import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import OrderTable from "@/components/main/order-table"

// Define TypeScript interface for the order structure
interface Order {
    _id: string
    orderId: string
    status: string
    createdAt: string
    mealName: string
    price: number
    orderedBy: string
    imageUrl: string
    quantity: number
    user: {
        firstName: string
        lastName: string
    }
    vendor: {
        name: string
    }
    selectedDays: string[]
    options: {
        protein: string
        sauce: string
        extras: string[]
    }
}

// Define TypeScript interface for props
interface Agency {
    _id: string
    imageUrl: string
    company: string
    branch: string
    users: {
        firstName: string
        lastName: string
        orders: Order[]
    }[]
}

interface Vendor {
    _id: string
    name: string
}

interface AgencyAccordionProps {
    agency: Agency
    vendor: Vendor
}

const AgencyAccordion: React.FC<AgencyAccordionProps> = ({ agency, vendor }) => {
    const { users } = agency

    // Ensure users have orders and filter by vendor ID
    const orders = users.flatMap((user) => user.orders?.filter((order) => order.vendor.name === vendor.name) || [])

    // Count pending orders
    const pendingOrders = orders.filter((order) => order.status === "pending")
    const hasPendingOrders = pendingOrders.length > 0

    return (
        <div className="w-full mb-4 perspective-1000">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                    value={agency._id}
                    className="border-none overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-green-50 group transition-all duration-300">
                        <div className="flex items-center gap-5 w-full">
                            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-[#71bc44] shadow-sm flex-shrink-0 transform transition-transform duration-500 group-data-[state=open]:scale-110">
                                <img
                                    src={agency.imageUrl || "/placeholder.svg"}
                                    alt={agency.company}
                                    className="h-full w-full object-cover"
                                />
                                {hasPendingOrders && (
                                    <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#71bc44] text-white flex items-center justify-center text-xs border-2 border-white animate-pulse">
                                        {pendingOrders.length}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-start text-left">
                                <h3 className="font-medium text-gray-900 text-lg group-data-[state=open]:text-[#71bc44] transition-colors duration-300">
                                    {agency.company}
                                </h3>
                                <p className="text-sm text-gray-500">{agency.branch}</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white px-6 py-5 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                        <div className="border-l-2 border-[#71bc44] pl-5 pt-2">
                            <OrderTable orders={orders} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AgencyAccordion
