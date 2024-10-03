'use client'

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/main/header"
import useAuthStore from "@/app/store/authenticate";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect} from "react";
import {useRouter} from "next/navigation";
import {ScaleLoader} from "react-spinners";
import useVendorStore from "@/app/store/vendor";

// Define types for the meal, user, order, agency, and vendor
interface Meal {
    main: string;
    price: number;
}

interface User {
    firstName: string;
    lastName: string;
    agency: {
        company: string;
    };
}

interface Order {
    orderId: string;
    user: User;
    meals: Meal[];
    status: string;
    createdAt: string | number | Date;
    totalPrice: number;
}

interface Agency {
    _id: string;
    company: string;
    branch: string;
    imageUrl: string;
    users: {
        orders: Order[];
    }[];
}

interface Vendor {
    orders?: Order[];
    meals?: Meal[];
    agencies?: Agency[];
    totalSales: number;
    completedOrders: number;
    canceledOrders: number;
}

export default function Dashboard() {
    const {vendor, fetchVendor} = useVendorStore();


    // Fetch vendor data if authenticated
    useEffect(() => {
            fetchVendor();

    }, [ fetchVendor]);

    // Sort and filter recent orders
    const recentOrders = vendor.orders
        ?.sort((a: { createdAt: string | number | Date }, b: {
            createdAt: string | number | Date
        }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);




    const agencies: Agency[] = vendor.agencies || [];

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header/>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vendor.orders?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vendor.completedOrders || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vendor.canceledOrders || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vendor.meals?.length || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GH₵{vendor?.totalSales?.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Enterprise(s)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vendor.agencies?.length || 0}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Transactions</CardTitle>
                                <CardDescription>Recent transactions from your store.</CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href={'/pages/orders'}>
                                    View All
                                    <ArrowUpRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Meal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders?.map((order: { orderId: Key | null | undefined; user: { firstName: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; lastName: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; agency: { company: any } }; meals: any[]; status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; createdAt: string | number | Date; totalPrice: number }) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {order.user?.firstName} {order.user?.lastName}
                                                </div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                    {order.user?.agency.company || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {order.meals.map((meal, index) => (
                                                    <div key={index}>{meal.main || 'N/A'}</div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="text-xs" variant="outline">
                                                    {order?.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order?.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">GH₵{order.meals.reduce((total, meal) => total + (meal.price || 0), 0)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Enterprise(s)</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-8 lg:gap-3">
                            {agencies?.map((agency) => (
                                <div className="flex items-center gap-4" key={agency._id}>
                                    <Avatar className="hidden h-12 w-10 sm:flex">
                                        <AvatarImage src={agency.imageUrl} alt={agency.company} />
                                        <AvatarFallback>{agency.company.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">{agency.company}</p>
                                        <p className="text-sm text-muted-foreground">{agency.branch}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
