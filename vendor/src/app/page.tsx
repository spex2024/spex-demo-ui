'use client'

import Link from "next/link"
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/main/header"
import useVendorStore from "@/app/store/vendor"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Dashboard() {
    const { vendor, fetchVendor } = useVendorStore()
    const [trends, setTrends] = useState({
        orderGrowth: 0,
        completedGrowth: 0,
        salesGrowth: 0,
        agencyGrowth: 0,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 5

    useEffect(() => {
        fetchVendor()
        calculateTrends()
    }, [fetchVendor])

    const calculateTrends = () => {
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7); // Subtract 7 days for a week

        // Filter orders from the last week
        const previousOrders = vendor.orders?.filter((order: { createdAt: string | number | Date }) => new Date(order.createdAt) >= oneWeekAgo);
        const previousCompleted = previousOrders?.filter((order: { status: string }) => order.status === 'completed'); // Adjust based on your status logic

        // Updated total sales calculation
        const previousSales = previousOrders?.reduce((total: number, order: { meals: Array<{ price: number }> }) => {
            // Calculate the total price of meals for the current order
            const mealsTotal = order.meals?.reduce((mealTotal: number, meal: { price: number }) => mealTotal + (meal.price || 0), 0);
            return total + mealsTotal; // Accumulate to the total sales
        }, 0);

        // Calculate unique agencies based on agencyId from orders
        const previousAgencies = new Set(previousOrders?.map((order: { agencyId: any }) => order.agencyId)); // Assuming each order has an agencyId

        // Get current order counts
        const currentOrders = vendor.orders?.length || 0; // This would be the total count of current orders
        const currentCompleted = vendor.completedOrders || 0; // This should be dynamically fetched from your state or API
        const currentSales = vendor.totalSales || 0; // This should be dynamically fetched from your state or API
        const currentAgencies = vendor.agencies?.length || 0; // Adjust as needed

        const calculateGrowth = (current: number, previous: number): number => {
            if (previous === 0) {
                return current > 0 ? 100 : 0; // If there were no previous orders, but there are current ones, set growth to 100
            }

            const growth = ((current - previous) / previous) * 100;

            // Return 0 if growth is negative
            return Math.max(growth, 0);
        };

        const orderGrowth = calculateGrowth(currentOrders, previousOrders?.length || 0);
        const completedGrowth = calculateGrowth(currentCompleted, previousCompleted?.length || 0);
        const salesGrowth = calculateGrowth(currentSales, previousSales || 0);
        const agencyGrowth = calculateGrowth(currentAgencies, previousAgencies?.size || 0); // Convert Set to size

        setTrends({
            orderGrowth,
            completedGrowth,
            salesGrowth,
            agencyGrowth,
        });
    };


    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentOrders = vendor.orders
        ?.filter((order: { createdAt: string | number | Date }) => new Date(order.createdAt) >= oneWeekAgo)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10);

    const agencies = vendor.agencies || []

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = recentOrders?.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa] dark:bg-[#1a1a1a]">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {[
                        { title: "Total Orders", icon: ShoppingCart, value: vendor.orders?.length || 0, trend: trends.orderGrowth, color: "border-[#71bc44]" },
                        { title: "Completed Orders", icon: Package, value: vendor.completedOrders || 0, trend: trends.completedGrowth, color: "border-[#c7b730]" },
                        { title: "Total Sales", icon: DollarSign, value: `GH₵${vendor?.totalSales?.toFixed(2)}`, trend: trends.salesGrowth, color: "border-[#71bc44]" },
                        { title: "Enterprise(s)", icon: Users, value: vendor.agencies?.length || 0, trend: trends.agencyGrowth, color: "border-[#c7b730]" },
                    ].map((item, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            <Card className={`bg-white dark:bg-[#2a2a2a] border-l-4 ${item.color} shadow-md hover:shadow-lg transition-all duration-300`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-[#333] dark:text-[#e0e0e0]">{item.title}</CardTitle>
                                    <item.icon className="h-4 w-4 text-[#71bc44]" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-[#333] dark:text-[#e0e0e0]">{item.value}</div>
                                    <p className="text-xs text-[#666] dark:text-[#999] flex items-center gap-1">
                                        {item.trend > 0 ? (
                                            <TrendingUp className="h-3 w-3 text-[#71bc44]" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 text-[#c7b730]" />
                                        )}
                                        {item.trend.toFixed(1)}% from last period
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-full lg:col-span-4 bg-white dark:bg-[#2a2a2a] shadow-md hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-[#333] dark:text-[#e0e0e0]">Recent Transactions</CardTitle>
                                <Button asChild size="sm" className="ml-auto bg-[#71bc44] hover:bg-[#5da438] text-white">
                                    <Link href="/pages/orders" className="flex items-center gap-1">
                                        View All
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <CardDescription className="text-[#666] dark:text-[#999]">You have {recentOrders?.length} transactions this week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-2 px-4 text-left text-sm font-medium text-[#333] dark:text-[#e0e0e0]">Customer</th>
                                        <th className="py-2 px-4 text-left text-sm font-medium text-[#333] dark:text-[#e0e0e0]">Meal</th>
                                        <th className="py-2 px-4 text-left text-sm font-medium text-[#333] dark:text-[#e0e0e0]">Status</th>
                                        <th className="py-2 px-4 text-left text-sm font-medium text-[#333] dark:text-[#e0e0e0]">Date</th>
                                        <th className="py-2 px-4 text-right text-sm font-medium text-[#333] dark:text-[#e0e0e0]">Amount</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentOrders?.map((order: any) => (
                                        <tr key={order.orderId} className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3a] transition-colors text-xs">
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8 border-2 border-[#71bc44]">
                                                        <AvatarImage src={` ${order.user?.imageUrl}`} />
                                                        <AvatarFallback>{order.user?.firstName?.charAt(0)}{order.user?.lastName?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="hidden sm:block">
                                                        <div className="font-medium text-[#333] dark:text-[#e0e0e0] uppercase">{order.user?.firstName} {order.user?.lastName}</div>
                                                        <div className="text-xs text-[#666] dark:text-[#999]">{order.user?.agency?.company || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <div className="flex flex-col gap-0.5">
                                                    {order.meals.slice(0, 1).map((meal: any) => (
                                                        <span key={meal._id} className="text-sm text-[#333] dark:text-[#e0e0e0]">{meal.main || 'N/A'}</span>
                                                    ))}
                                                    {order.meals.length > 1 && (
                                                        <span className="text-xs text-[#666] dark:text-[#999]">+{order.meals.length - 1} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2 px-4">
                                                <Badge
                                                    variant={order?.status === 'Completed' ? 'default' : 'secondary'}
                                                    className={`text-xs ${
                                                        order?.status === 'complete'
                                                            ? 'bg-green-300 text-white'
                                                            : order?.status === 'pending'
                                                                ? 'bg-yellow-300 text-black'
                                                                : 'bg-red-400 text-white'
                                                    }`}
                                                >
                                                    {order?.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-4 text-[#333] dark:text-[#e0e0e0]">{new Date(order?.createdAt).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 text-right font-medium text-[#333] dark:text-[#e0e0e0]">
                                                GH₵{order.meals.reduce((total: any, meal: any) => total + (meal.price || 0), 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                                <Button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bg-[#71bc44] hover:bg-[#5da438] text-white w-full sm:w-auto"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <span className="text-[#333] dark:text-[#e0e0e0] text-sm">
                                    Page {currentPage} of {Math.ceil((recentOrders?.length || 0) / ordersPerPage)}
                                </span>
                                <Button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil((recentOrders?.length || 0) / ordersPerPage)}
                                    className="bg-[#71bc44] hover:bg-[#5da438] text-white w-full sm:w-auto"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-full lg:col-span-3 bg-white dark:bg-[#2a2a2a] shadow-md hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold text-[#333] dark:text-[#e0e0e0]">Enterprise(s)</CardTitle>
                            <CardDescription className="text-[#666] dark:text-[#999]">You have {agencies.length} associated enterprises.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                                {agencies?.map((agency: any) => (
                                    <div key={agency._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg hover:bg-[#f0f0f0] dark:hover:bg-[#3a3a3a] transition-colors">
                                        <Avatar className="h-12 w-12 border-2 border-[#c7b730]">
                                            <AvatarImage src={agency.imageUrl} alt={agency?.company} />
                                            <AvatarFallback>{agency.company?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <p className="text-sm font-medium text-[#333] dark:text-[#e0e0e0]">{agency?.company}</p>
                                            <p className="text-xs text-[#666] dark:text-[#999]">{agency.branch}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs bg-[#71bc44] text-white">
                                                    {agency.users.length} Users
                                                </Badge>
                                                <Badge variant="outline" className="text-xs bg-[#c7b730] text-black">
                                                    {agency.users.reduce((total: any, user: any) => total + user.orders.length, 0)} Orders
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}