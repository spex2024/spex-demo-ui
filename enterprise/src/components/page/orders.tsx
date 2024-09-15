'use client'

import Image from "next/image";
import {
    CircleArrowLeft,
    CircleArrowRight,
    File,
    ListFilter,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useUserStore } from "@/store/profile";
import { useEffect, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

// Define types for user data and orders
interface Meal {
    main: string;
    // Add other properties of Meal if necessary
}

interface Vendor {
    name: string;
    // Add other properties of Vendor if necessary
}

interface Order {
    orderId: string;
    meals: Meal[]; // Changed to an array of Meal objects
    quantity: number;
    status: string;
    createdAt: string; // Assuming ISO date string
    user: { // Added user details
        firstName: string;
        lastName: string;
    };
    vendor: Vendor; // Added vendor details
}

interface User {
    imageUrl: string | StaticImport;
    firstName: string;
    lastName: string;
    email: string;
    points: number;
    code: string;
    createdAt: string; // Assuming ISO date string
    phone: string;
    isVerified: boolean;
    orders: Order[]; // Orders associated with the user
}

interface UserState {
    user: {
        users: User[]; // Sub-array of users
    } | null; // Handle possible null value
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

export default function OrderData() {
    const { user, fetchUser } = useUserStore() as UserState;
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Handle case where user might be null
    const users = user?.users || [];

    // Extract orders from users
    const orders = users.flatMap(user => user.orders); // Flatten orders from all users

    // Calculate the index of the first and last order on the current page
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    // Slice orders to display only those on the current page
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Calculate total number of pages
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Completed</TabsTrigger>
                                <TabsTrigger value="draft">Cancelled</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem>
                                            Completed
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" variant="outline" className="h-7 gap-1">
                                    <File className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Orders</CardTitle>
                                    <CardDescription>
                                        Manage your orders and view their information.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    <span>Vendor</span>
                                                </TableHead>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Meal</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Ordered By</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Created At
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentOrders.map((order) => (
                                                <TableRow key={order.orderId}>
                                                    <TableCell className="hidden sm:table-cell">
                                                        {order.vendor.name}  {/* Display vendor */}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {order.orderId}
                                                    </TableCell>
                                                    {order.meals.map((meal, index) => (
                                                        <TableCell key={index}>
                                                            {meal.main}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>{order.quantity}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={order.status === 'Completed' ? "outline" : "secondary"}>
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.user.firstName} {order.user.lastName} {/* Display user */}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className={`w-full`}>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-xs text-muted-foreground">
                                            Showing <strong>{indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)}</strong> of <strong>{orders.length}</strong> orders
                                        </div>
                                        <div className="flex gap-4">
                                            <Button
                                                variant={'ghost'}
                                                className={`flex gap-x-2 items-center`}
                                                size="sm"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                            >
                                                <CircleArrowLeft size={20} strokeWidth={1} /> Previous
                                            </Button>
                                            <Button
                                                className={`flex gap-x-2 items-center justify-center`}
                                                variant="ghost"
                                                size="sm"
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                            >
                                                Next <CircleArrowRight size={20} strokeWidth={1} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
