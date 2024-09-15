'use client';

import Image from "next/image";
import {CircleArrowLeft, File, ListFilter, MoreHorizontal, PlusCircle , CircleArrowRight} from "lucide-react";
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
    DropdownMenuItem,
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
import { useState } from "react";
import { format } from 'date-fns';

interface Meal {
    mealId: string;
    price: number;
    main: string;
}

interface Order {
    orderId: string;
    status: string;
    createdAt: string; // assuming it's an ISO string
    meals: Meal[];
    orderedBy: string;
    imageUrl: string;
    quantity: number;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface User {
    id: string;
    name: string;
    orders: Order[];
}

interface OrderTableProps {
    user: User[]; // Changed from `user` to `users` for clarity
}

export default function OrderTable({ user }: OrderTableProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5;

    // Flatten the orders from all users
    const orders = user.flatMap(user => user.orders);

    // Calculate total pages
    const totalPages = Math.ceil(orders.length / rowsPerPage);

    // Get the orders for the current page
    const paginatedOrders = orders.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Pending</TabsTrigger>
                                <TabsTrigger value="draft">Completed</TabsTrigger>
                                <TabsTrigger value="archived" className="hidden sm:flex">
                                    Cancelled
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem>
                                            Pending
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Cancelled
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" variant="outline" className="h-7 gap-1">
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button>

                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Orders</CardTitle>
                                    <CardDescription>
                                        Manage your orders and view their status.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="">Image</span>
                                                </TableHead>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Meal</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Created At</TableHead>
                                                <TableHead>Ordered By</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedOrders.map(order => (
                                                <TableRow key={order.orderId}>
                                                    <TableCell className="">
                                                        <Image
                                                            alt="Order image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height={64}
                                                            src={order.imageUrl}
                                                            width={64}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {order.orderId}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {order.meals.map(meal => meal.main)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        GH₵{order.meals.reduce((total, meal) => total + meal.price, 0).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.quantity}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                                    </TableCell>
                                                    <TableCell className={``}>
                                                        <div className={`flex gap-2`}>
                                                            <span>{order.user.firstName}</span>
                                                            <span>{order.user.lastName}</span>
                                                        </div>
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <div className=" w-full flex justify-between items-center">
                                        <div className="text-xs text-muted-foreground">
                                            Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong>-
                                            <strong>{Math.min(currentPage * rowsPerPage, orders.length)}</strong> of <strong>{orders.length}</strong> orders
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                className={`flex gap-2`}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <CircleArrowLeft size={20} strokeWidth={1}/> Previous
                                            </Button>
                                            <Button
                                                className={`flex gap-2`}
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                                                disabled={currentPage === totalPages}
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
