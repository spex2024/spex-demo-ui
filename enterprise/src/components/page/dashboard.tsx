'use client';
import Link from 'next/link';
import {
    Activity,
    ArrowUpRight,
    CreditCard,
    Users,
} from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import Header from '@/components/page/header';
import { useUserStore } from '@/store/profile';
import { useEffect } from 'react';
import { AddVendor } from './add-vendor';
import {VendorMetricsModal} from "@/components/page/vendor-metrics";

interface Meal {
    mealId: string;
    main?: string;
    protein?: string;
    sauce?: string;
    price?:number
    extras?: string[];
}

interface Order {
    orderId: string;
    vendor: Vendor; // Ensure Vendor type is defined
    meals: Meal[]; // Changed from meal to meals array
    status: string;
    createdAt: string; // Use ISO date string
    totalPrice: number;
    user: {
        firstName: string;
        lastName: string;
    };
}

interface Vendor {
    _id: string;
    imageUrl?: string;
    code?: string;
    name: string;
    location: string;
    totalSales: number;
}

interface UserSub {
    orders: Order[];
}

interface User {
    imageUrl?: string;
    company?: string;
    orders?: Order[];
    vendors?: Vendor[];
    users?: UserSub[];
    packs?:number;
    emissionSaved?:number;
    points?:number;
    issuedPack?:number;
    returnedPack?:number;
    moneyBalance?:number;
}

interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}

export default function Dashboard() {
    const { user, fetchUser } = useUserStore() as UserStore;

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Flatten orders from all users
    const allOrders = user?.users?.flatMap(user => user.orders) || [];

    // Sort orders by date in descending order and limit to 5
    const orders = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const vendors = user?.vendors || [];

    console.log('vendor :', vendors)

    function calculateVendorSalesByTimeframe(vendorId: string, allOrders: Order[], timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): number {
        const now = new Date();

        return allOrders.reduce((total, order) => {
            if (order.vendor._id === vendorId && order.status === 'completed') {
                const orderDate = new Date(order.createdAt);
                const isWithinTimeframe = checkTimeframe(orderDate, now, timeframe);

                if (isWithinTimeframe) {
                    const orderTotal = order.meals.reduce((orderSum, meal) => orderSum + (meal.price || 0), 0);
                    return total + orderTotal;
                }
            }
            return total;
        }, 0);
    }

// Helper function to check if an order is within the given timeframe
    function checkTimeframe(orderDate: Date, now: Date, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): boolean {
        switch (timeframe) {
            case 'daily':
                return orderDate.toDateString() === now.toDateString(); // Same day
            case 'weekly':
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
                return orderDate > oneWeekAgo;
            case 'monthly':
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            case 'yearly':
                return orderDate.getFullYear() === now.getFullYear();
            default:
                return false;
        }
    }


    const limitWords = (text: string, maxWords: number) => {
        const words = text.split(' ');
        return words.length > maxWords
            ? words.slice(0, maxWords).join(' ') + '...'
            : text;
    };


    const remaining = (user?.packs ?? 0) - (user?.issuedPack ?? 0)

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header/>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Card x-chunk="dashboard-01-chunk-0">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {allOrders.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.users?.length}</div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Packs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full flex   justify-between gap-3 text-2xl ">
                                <p className={`font-bold`}>{user?.packs}</p>
                                <div className={`w-full flex  justify-end mt-2 gap-2 text-xs `}>
                                    <p className={`w-[80%] flex flex-col items-end
                                     text:muted`}>
                                        <span>Issued</span>
                                        <span> {user?.issuedPack}</span>
                                    </p>
                                    <p className={'h-8  border border-gray-500 '}></p>
                                    <p className={`w-[50%] flex flex-col  text:muted`}>
                                        <span> Remaining</span>
                                        <span> {remaining} </span></p>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Packs</CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.packs}</div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Returned Packs</CardTitle>

                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.returnedPack}</div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Emission Saved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.emissionSaved}</div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium"> Carbon Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.points}</div>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-7">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium"> Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user?.moneyBalance}</div>
                        </CardContent>
                    </Card>

                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
                        <CardHeader className="flex flex-row items-center">
                            <div className="grid gap-2">
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Recent transactions by employees.</CardDescription>
                            </div>
                            <Button asChild size="sm" className="ml-auto gap-1">
                                <Link href={'/orders'}>
                                    View All
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead className="">Meal</TableHead>
                                        <TableHead className="">Status</TableHead>
                                        <TableHead className="">Date</TableHead>
                                        <TableHead className="">Amount</TableHead>
                                        <TableHead className="">Ordered By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>
                                                <div className="font-medium">{order.vendor.name}</div>
                                                <div className="text-sm text-muted-foreground md:inline">{order.vendor.code}</div>
                                            </TableCell>
                                            <TableCell>
                                                {order.meals.map((meal) => (
                                                    <div key={meal.mealId}>{meal.main || 'N/A'}</div>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="text-xs" variant="outline">{order.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="">GH₵ {order.meals.reduce((total, meal) => total + (meal.price || 0), 0)}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {order.user.firstName} {order.user.lastName}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card x-chunk="dashboard-01-chunk-5">
                        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2">`}>
                            <CardTitle>Vendor(s)</CardTitle>
                            {vendors && vendors.length > 0 && (
                                <div>
                                    <AddVendor />
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="grid gap-8">
                            {vendors?.length === 0 ? (
                                <div className="flex flex-col items-center gap-4">
                                    <p>Add more vendors</p>
                                    <AddVendor />
                                </div>
                            ) : (
                                vendors.map((vendor) => (
                                    <div className="flex items-center justify-between gap-4" key={vendor._id}>
                                        <Avatar className="hidden h-12 w-13 sm:flex">
                                            <AvatarImage src={vendor.imageUrl} alt="Avatar" />
                                            <AvatarFallback>{vendor.code}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-xs font-medium leading-none">{limitWords(vendor.name,5)}</p>
                                            <p className="text-xs text-muted-foreground">{limitWords(vendor.location,4)}</p>
                                        </div>
                                        <div className=" ml-auto font-medium">
                                            <p className="text-sm font-medium leading-none">GH₵ {vendor.totalSales}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Total Sales
                                            </p>

                                        </div>

                                        {/* Add VendorMetricsModal here */}

                                        <VendorMetricsModal
                                            vendorName={vendor.name}
                                            metrics={{
                                                daily: calculateVendorSalesByTimeframe(vendor._id, allOrders, 'daily'),
                                                weekly: calculateVendorSalesByTimeframe(vendor._id, allOrders, 'weekly'),
                                                monthly: calculateVendorSalesByTimeframe(vendor._id, allOrders, 'monthly'),
                                                yearly: calculateVendorSalesByTimeframe(vendor._id, allOrders, 'yearly'),
                                            }}
                                        />

                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}