'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {Activity, ArrowUpRight, ArrowDownRight, CreditCard, Users, Package, Leaf, Zap, ViewIcon} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from '@/components/page/header'
import { useUserStore } from '@/store/profile'
import { AddVendor } from './add-vendor'
import { VendorMetricsModal } from "@/components/page/vendor-metrics"

import { subMonths, isSameMonth } from 'date-fns'

interface Meal {
    mealId: string
    main?: string
    protein?: string
    sauce?: string
    price?: number
    extras?: string[]
}

interface Subcription{
    plan:string
}

interface Order {
    orderId: string
    vendor: Vendor
    meals: Meal[]
    status: string
    createdAt: string
    totalPrice: number
    user: {
        firstName: string
        lastName: string
        points: number
    }
    moneyBalance:number
    emissionSaved:number
}

interface Vendor {
    _id: string
    imageUrl?: string
    code?: string
    name: string
    location: string
    totalSales: number
}

interface UserSub {
    orders: Order[]
    activePack: number
    emissionSaved?: number
    points?: number
    moneyBalance?: number
    returnedPack?: number
}

interface User {
    imageUrl?: string
    company?: string
    orders?: Order[]
    vendors?: Vendor[]
    users?: UserSub[]
    packs?: number
    activePack?: number
    emissionSaved?: number
    points?: number
    issuedPack?: number
    availablePacks?: number
    returnedPack?: number
    moneyBalance?: number
    subscription?:Subcription
}

interface UserStore {
    user?: User
    fetchUser: () => Promise<void>
}

function StatCard({ title, value, icon, trend }: { title: string; value: any; icon: any; trend: number }) {
    return (
        <div className="group relative overflow-hidden rounded-lg transition-all hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
            <Card className="relative h-full transition-all group-hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="mt-2 flex items-center text-xs">
                        <span className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? (
                                <ArrowUpRight className="mr-1 h-3 w-3" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-3 w-3" />
                            )}
                            {Math.abs(trend)}%
                        </span>
                        <span className="ml-1 text-muted-foreground">from last period</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function Dashboard() {
    const { user, fetchUser } = useUserStore() as UserStore

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const allOrders = user?.users?.flatMap(user => user.orders) || []
    const vendors = user?.vendors || []

    // Define current and previous periods
    const now = new Date()
    const previousMonth = subMonths(now, 1)

    // Helper function to filter orders by month
    const filterOrdersByMonth = (orders: Order[], date: Date) => {
        return orders.filter(order => isSameMonth(new Date(order.createdAt), date))
    }

    // Calculate current and previous metrics
    const currentOrders = filterOrdersByMonth(allOrders, now)
    const previousOrders = filterOrdersByMonth(allOrders, previousMonth)

    const currentActivePacks = user?.users?.reduce((total, user) => total + (user.activePack || 0), 0) || 0
    const previousActivePacks = filterOrdersByMonth(allOrders, previousMonth).reduce((total, order) => {
        if (order.status === 'active') return total + 1
        return total
    }, 0)

    const currentReturnedPacks = user?.users?.reduce((total, user) => total + (user.returnedPack || 0), 0) || 0
    const previousReturnedPacks = filterOrdersByMonth(allOrders, previousMonth).reduce((total, order) => {
        if (order.status === 'returned') return total + 1
        return total
    }, 0)

    const currentPoints = user?.users?.reduce((total, user) => total + (user.points || 0), 0) || 0
    const previousPoints = filterOrdersByMonth(allOrders, previousMonth).reduce((total, order) => {
        return total + (order.user.points || 0)
    }, 0)

    const currentMoneyBalance = user?.users?.reduce((total, user) => total + (user.moneyBalance || 0), 0) || 0
    const previousMoneyBalance = filterOrdersByMonth(allOrders, previousMonth).reduce((total, order) => {
        return total + (order.moneyBalance || 0)
    }, 0)

    const currentEmissionSaved = user?.users?.reduce((total, user) => total + (user.emissionSaved || 0), 0) || 0
    const previousEmissionSaved = filterOrdersByMonth(allOrders, previousMonth).reduce((total, order) => {
        return total + (order.emissionSaved || 0)
    }, 0)

    const calculateTrend = (current: number, previous: number): number => {
        if (previous === 0) return current === 0 ? 0 : 100; // Avoid division by zero
        const trend = ((current - previous) / previous) * 100;
        return Math.min(trend, 100); // Cap the maximum trend at 100%
    };


    // Calculate trends
    const trendTotalOrders = calculateTrend(currentOrders.length, previousOrders.length)
    const trendTotalEmployees = calculateTrend(user?.users?.length || 0, user?.users?.length || 0) // Assuming employees count is stable
    const trendTotalPacks = calculateTrend(user?.availablePacks || 0, user?.packs || 0) // Assuming packs count is stable
    const trendActivePacks = Number(calculateTrend(currentActivePacks, previousActivePacks).toFixed(2));
    const trendReturnedPacks = Number(calculateTrend(currentReturnedPacks, previousReturnedPacks).toFixed(2));
    const trendEmissionSaved = Number(calculateTrend(currentEmissionSaved, previousEmissionSaved).toFixed(2));
    const trendPoints = Number(calculateTrend(currentPoints, previousPoints).toFixed(2));
    const trendMoneyBalance = Number(calculateTrend(currentMoneyBalance, previousMoneyBalance).toFixed(2));

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Set the date to one week ago

    const orders = allOrders
        .filter(order => new Date(order.createdAt) >= oneWeekAgo) // Filter orders created in the last week
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by createdAt in descending order



    function calculateVendorSalesByTimeframe(vendorId: string, allOrders: Order[], timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): number {
        const now = new Date()
        return allOrders.reduce((total, order) => {
            if (order.vendor._id === vendorId && order.status === 'completed') {
                const orderDate = new Date(order.createdAt)
                const isWithinTimeframe = checkTimeframe(orderDate, now, timeframe)
                if (isWithinTimeframe) {
                    const orderTotal = order.meals.reduce((orderSum, meal) => orderSum + (meal.price || 0), 0)
                    return total + orderTotal
                }
            }
            return total
        }, 0)
    }

    function checkTimeframe(orderDate: Date, now: Date, timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly'): boolean {
        switch (timeframe) {
            case 'daily':
                return orderDate.toDateString() === now.toDateString()
            case 'weekly':
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                return orderDate > oneWeekAgo
            case 'monthly':
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
            case 'yearly':
                return orderDate.getFullYear() === now.getFullYear()
            default:
                return false
        }
    }

    const limitWords = (text: string, maxWords: number) => {
        const words = text.split(' ')
        return words.length > maxWords
            ? words.slice(0, maxWords).join(' ') + '...'
            : text
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex-1 space-y-6 p-6 md:p-8">
                <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 border-b">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">{user?.company || 'Dashboard'}</h2>
                        <Badge variant="secondary" className="text-xs font-semibold flex items-center justify-items-center gap-3">
                            <p>Plan: {user?.subscription?.plan || 'N/A'}</p>
                            <p>Packs: {user?.packs || 'N/A'}</p>

                        </Badge>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/orders" className="flex items-center gap-2">
                            View All Orders
                            <ArrowUpRight className="h-4 w-4"/>
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Orders"
                        value={currentOrders.length}
                        icon={<CreditCard className="h-4 w-4"/>}
                        trend={trendTotalOrders}
                    />
                    <StatCard
                        title="Total Employees"
                        value={user?.users?.length || 0}
                        icon={<Users className="h-4 w-4"/>}
                        trend={trendTotalEmployees}
                    />
                    <StatCard
                        title="Total Packs Available"
                        value={
                            <div className="w-full flex  justify-between">
                                <div className="text-2xl font-bold">{user?.packs || 0}</div>
                                <div className=" w-[40%] flex justify-between items-center text-xs text-muted-foreground ">
                                    <div className="flex flex-col items-start">
                                        <span>Issued</span>
                                        <span>{user?.issuedPack || 0}</span>
                                    </div>
                                    <div className="h-5 border-r border-gray-300"></div>
                                    <div className="flex flex-col items-end">
                                        <span>Remaining</span>
                                        <span>{user?.packs || 0}</span>
                                    </div>
                                </div>
                            </div>
                        }
                        icon={<Package className="h-4 w-4"/>}
                        trend={trendTotalPacks}
                    />
                    <StatCard
                        title="Active Packs"
                        value={currentActivePacks}
                        icon={<Activity className="h-4 w-4"/>}
                        trend={trendActivePacks}
                    />
                    <StatCard
                        title="Returned Packs"
                        value={currentReturnedPacks}
                        icon={<ArrowUpRight className="h-4 w-4"/>}
                        trend={trendReturnedPacks}
                    />
                    <StatCard
                        title="Emission Saved"
                        value={`${currentEmissionSaved.toFixed(2)} kg`}
                        icon={<Leaf className="h-4 w-4"/>}
                        trend={trendEmissionSaved}
                    />
                    <StatCard
                        title="Carbon Points"
                        value={currentPoints.toFixed(2)}
                        icon={<Zap className="h-4 w-4"/>}
                        trend={trendPoints}
                    />
                    <StatCard
                        title="Revenue"
                        value={`GH₵ ${currentMoneyBalance.toFixed(2)}`}
                        icon={<CreditCard className="h-4 w-4"/>}
                        trend={trendMoneyBalance}
                    />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>You made {orders.length} orders this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Meal</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Ordered By</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.orderId}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={order.vendor.imageUrl}
                                                                         alt={order.vendor.name}/>
                                                            <AvatarFallback>{order.vendor.code}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div
                                                                className="font-medium">{limitWords(order.vendor.name, 3)}</div>
                                                            <div
                                                                className="text-sm text-muted-foreground">{order.vendor.code}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {order.meals.map((meal, index) => (
                                                        <div key={meal.mealId} className="text-sm">
                                                            {index > 0 && ', '}
                                                            {limitWords(meal.main || 'N/A', 2)}
                                                        </div>
                                                    ))}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            order.status === 'completed'
                                                                ? 'bg-green-200 text-green-800'  // Lighter green with dark green text
                                                                : order.status === 'pending'
                                                                    ? 'bg-yellow-200 text-yellow-800' // Lighter yellow with dark yellow text
                                                                    : order.status === 'cancelled' || order.status === 'failed'
                                                                        ? 'bg-red-200 text-red-800'       // Lighter red with dark red text
                                                                        : 'bg-gray-200 text-gray-800'     // Lighter gray with dark gray text for other statuses
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>GH₵ {order.meals.reduce((total, meal) => total + (meal.price || 0), 0).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div
                                                        className="font-medium">{`${order.user.firstName} ${order.user.lastName}`}</div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>Vendor Performance</CardTitle>
                            {vendors && vendors.length < 2 && (
                                <AddVendor/>
                            )}
                        </CardHeader>
                        <CardContent>
                            {vendors?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px]">
                                    <p className="text-muted-foreground mb-4">No vendors added yet</p>
                                    <AddVendor/>
                                </div>
                            ) : (
                                <ScrollArea className="h-[400px] pr-4">
                                    {vendors.map((vendor) => (
                                        <div key={vendor._id} className="mb-6 last:mb-0">
                                            <Card className="overflow-hidden transition-all hover:shadow-md">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <Avatar className="h-12 w-12">
                                                                <AvatarImage src={vendor.imageUrl} alt={vendor.name}/>
                                                                <AvatarFallback>{vendor.code}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-semibold text-lg">{limitWords(vendor.name, 3)}</p>
                                                                <p className="text-sm text-muted-foreground">{limitWords(vendor.location, 3)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg">GH₵ {vendor.totalSales.toFixed(2)}</p>
                                                            <p className="text-sm text-muted-foreground">Total Sales</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                                        {['daily', 'weekly', 'monthly', 'yearly'].map((timeframe) => (
                                                            <div key={timeframe}
                                                                 className="bg-secondary/10 rounded-lg p-2">
                                                                <p className="text-xs text-muted-foreground capitalize">{timeframe} Sales</p>
                                                                <p className="font-medium">
                                                                    GH₵ {calculateVendorSalesByTimeframe(vendor._id, allOrders, timeframe as 'daily' | 'weekly' | 'monthly' | 'yearly').toFixed(2)}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
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
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </ScrollArea>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
