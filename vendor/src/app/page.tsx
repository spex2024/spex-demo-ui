"use client"

import Link from "next/link"
import {
    ArrowUpRight,
    DollarSign,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    CircleDashed,
    XCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Header from "@/components/main/header"
import useVendorStore from "@/app/store/vendor"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative border-none bg-white/10 hover:bg-white/20">
                    <Bell className="h-5 w-5 text-[#71bc44]" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#71bc44] text-[10px] font-medium text-white">
            3
          </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b border-[#71bc44]/20 px-4 py-3 bg-[#71bc44]/5">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-[#333] dark:text-[#e0e0e0]">Notifications</h4>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-[#71bc44]">
                            Mark all as read
                        </Button>
                    </div>
                </div>
                <div className="max-h-[300px] overflow-auto">
                    <div className="grid gap-1 p-1">
                        {[
                            { title: "New order received", desc: "You have a new order from Acme Corp", time: "10 minutes ago" },
                            { title: "Order completed", desc: "Order #1234 has been marked as completed", time: "30 minutes ago" },
                            { title: "Payment received", desc: "Payment of GH₵120 has been processed", time: "2 hours ago" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 rounded-lg p-3 hover:bg-[#71bc44]/5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#71bc44]/10">
                                    {i === 0 ? (
                                        <ShoppingCart className="h-4 w-4 text-[#71bc44]" />
                                    ) : i === 1 ? (
                                        <Package className="h-4 w-4 text-[#71bc44]" />
                                    ) : (
                                        <DollarSign className="h-4 w-4 text-[#71bc44]" />
                                    )}
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none text-[#333] dark:text-[#e0e0e0]">{item.title}</p>
                                    <p className="text-xs text-[#666] dark:text-[#999]">{item.desc}</p>
                                    <p className="text-xs text-[#666] dark:text-[#999]">{item.time}</p>
                                </div>
                                <div className="ml-auto flex h-full items-center">
                                    <span className="flex h-2 w-2 rounded-full bg-[#71bc44]"></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border-t border-[#71bc44]/20 p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center text-[#71bc44]">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

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
        const now = new Date()
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(now.getDate() - 7) // Get the date one week ago

        // Filter orders from the last week
        const previousOrders =
            vendor.orders?.filter(
                (order: { createdAt: string | number | Date }) => new Date(order.createdAt) >= oneWeekAgo,
            ) || []
        const previousCompleted = previousOrders.filter((order: { status: string }) => order.status === "completed")

        // Calculate total sales for previous orders
        const previousSales = previousOrders.reduce(
            (total: number, order: { price?: number }) => total + (order.price || 0),
            0,
        )

        // Calculate unique agencies from previous orders
        const previousAgencies = new Set(previousOrders.map((order: { agencyId: any }) => order.agencyId))

        // Get current values for orders, completed orders, sales, and agencies
        const currentOrders = vendor.orders?.length || 0 // Total current orders
        const currentCompleted =
            vendor.orders?.filter((order: { status: string }) => order.status === "completed").length || 0 // Total completed orders
        const currentSales =
            vendor.orders?.reduce((total: number, order: { price?: number }) => total + (order.price || 0), 0) || 0
        const currentAgencies = new Set(vendor.orders?.map((order: { agencyId: any }) => order.agencyId)).size || 0

        // Function to calculate growth percentage
        const calculateGrowth = (current: number, previous: number) => {
            if (previous === 0) {
                return current > 0 ? 100 : 0 // If no previous data, set growth to 100% if current exists
            }
            return ((current - previous) / previous) * 100
        }

        // Calculate growth metrics
        const orderGrowth = calculateGrowth(currentOrders, previousOrders.length)
        const completedGrowth = calculateGrowth(currentCompleted, previousCompleted.length)
        const salesGrowth = calculateGrowth(currentSales, previousSales)
        const agencyGrowth = calculateGrowth(currentAgencies, previousAgencies.size)

        // Set the trends state with calculated growth values
        setTrends({
            orderGrowth,
            completedGrowth,
            salesGrowth,
            agencyGrowth,
        })
    }

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const recentOrders = vendor.orders
        ?.filter((order: { createdAt: string | number | Date }) => new Date(order.createdAt) >= oneWeekAgo)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)

    const agencies = vendor.agencies || []

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = recentOrders?.slice(indexOfFirstOrder, indexOfLastOrder)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const totalSales = vendor?.orders?.reduce((total: any, order: { price: any }) => {
        return total + (order.price || 0) // Add each order's price to the total
    }, 0)

    const getStatusIcon = (status: string) => {
        if (status === "complete") return <CheckCircle2 className="h-4 w-4 text-[#71bc44]" />
        if (status === "pending") return <CircleDashed className="h-4 w-4 text-[#71bc44]/70" />
        return <XCircle className="h-4 w-4 text-[#71bc44]/50" />
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa] dark:bg-[#1a1a1a]">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8 xl:px-12 max-w-[1600px] mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#333] dark:text-[#e0e0e0]">Vendor Dashboard</h1>
                        <p className="text-sm text-[#666] dark:text-[#999]">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            Welcome back! Here's what's happening with your business today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#666] dark:text-[#999]" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="h-10 w-[180px] rounded-md border border-[#ddd] dark:border-[#444] bg-white dark:bg-[#2a2a2a] pl-8 pr-3 text-sm text-[#333] dark:text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#71bc44]"
                            />
                        </div>
                        <NotificationBell />
                        <Button className="bg-[#71bc44] hover:bg-[#71bc44]/90 text-white">
                            <Link href="/pages/orders" className="flex items-center gap-1">
                                View Orders
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                <motion.div
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                    }}
                >
                    {[
                        {
                            title: "Total Orders",
                            icon: ShoppingCart,
                            value: vendor.orders?.length || 0,
                            trend: trends.orderGrowth,
                            gradient: "from-[#71bc44]/20 to-[#71bc44]/5",
                        },
                        {
                            title: "Completed Orders",
                            icon: Package,
                            value: vendor.completedOrders || 0,
                            trend: trends.completedGrowth,
                            gradient: "from-[#71bc44]/30 to-[#71bc44]/10",
                        },
                        {
                            title: "Total Sales",
                            icon: DollarSign,
                            value: `GH₵${totalSales?.toFixed(2) || 0}`,
                            trend: trends.salesGrowth,
                            gradient: "from-[#71bc44]/20 to-[#71bc44]/5",
                        },
                        {
                            title: "Enterprise(s)",
                            icon: Users,
                            value: vendor.agencies?.length || 0,
                            trend: trends.agencyGrowth,
                            gradient: "from-[#71bc44]/30 to-[#71bc44]/10",
                        },
                    ].map((item, index) => (
                        <motion.div key={index} variants={cardVariants}>
                            <Card className="overflow-hidden bg-white dark:bg-[#2a2a2a] shadow-md hover:shadow-lg transition-all duration-300 border-none">
                                <div className="h-1 bg-[#71bc44]"></div>
                                <CardContent className="p-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-[#333] dark:text-[#e0e0e0] text-sm">{item.title}</h3>
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient}`}
                                        >
                                            <item.icon className="h-4 w-4 text-[#71bc44]" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-[#333] dark:text-[#e0e0e0]">{item.value}</div>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div
                                            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#71bc44]/10"
                                            style={{ color: "#71bc44" }}
                                        >
                                            {item.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            {Math.abs(item.trend).toFixed(1)}%
                                        </div>
                                        <p className="text-xs text-[#666] dark:text-[#999]">from last period</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Transactions Section - Left Side */}
                    <Card className="lg:col-span-2 bg-white dark:bg-[#2a2a2a] shadow-md overflow-hidden border-none">
                        <div className="h-1 bg-gradient-to-r from-[#71bc44] to-[#71bc44]/50"></div>
                        <CardHeader className="pb-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-[#333] dark:text-[#e0e0e0]">
                                        Recent Transactions
                                    </CardTitle>
                                    <CardDescription className="text-[#666] dark:text-[#999]">
                                        You have {recentOrders?.length} transactions this week.
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1 border-[#71bc44]/20 text-[#71bc44] hover:bg-[#71bc44]/5 hover:text-[#71bc44]"
                                            >
                                                <Filter className="h-3.5 w-3.5" />
                                                Filter
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="bg-white dark:bg-[#2a2a2a] border-[#ddd] dark:border-[#444]"
                                        >
                                            <DropdownMenuItem className="text-[#333] dark:text-[#e0e0e0]">All Orders</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[#333] dark:text-[#e0e0e0]">Completed</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[#333] dark:text-[#e0e0e0]">Pending</DropdownMenuItem>
                                            <DropdownMenuItem className="text-[#333] dark:text-[#e0e0e0]">Cancelled</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button asChild size="sm" className="bg-[#71bc44] hover:bg-[#71bc44]/90 text-white">
                                        <Link href="/pages/orders" className="flex items-center gap-1">
                                            View All
                                            <ArrowUpRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="space-y-3">
                                {currentOrders?.map((order: any, index: number) => (
                                    <div
                                        key={order.orderId}
                                        className="relative overflow-hidden rounded-lg bg-white dark:bg-[#2a2a2a] border border-[#71bc44]/10 hover:border-[#71bc44]/30 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "#71bc44" }}></div>
                                        <div className="p-4 pl-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 ring-2 ring-[#71bc44]/20">
                                                        <AvatarImage src={` ${order.user?.imageUrl}`} />
                                                        <AvatarFallback className="bg-[#71bc44]/10 text-[#71bc44]">
                                                            {order.user?.firstName?.charAt(0)}
                                                            {order.user?.lastName?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-[#333] dark:text-[#e0e0e0]">
                                                            {order.user?.firstName} {order.user?.lastName}
                                                        </div>
                                                        <div className="text-xs text-[#666] dark:text-[#999] flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(order?.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className="font-bold text-[#333] dark:text-[#e0e0e0]">GH₵{order.price}</div>
                                                        <div className="flex items-center gap-1 text-xs text-[#71bc44]">
                                                            {getStatusIcon(order?.status)}
                                                            <span>{order?.status}</span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full text-[#71bc44] hover:bg-[#71bc44]/10"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-2 pl-12">
                                                <div className="text-sm text-[#333] dark:text-[#e0e0e0]">{order.mealName}</div>
                                                <div className="text-xs text-[#666] dark:text-[#999] mt-0.5">
                                                    {order.user?.agency?.company || "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center mt-5 gap-2">
                                <Button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#71bc44]/20 text-[#71bc44] hover:bg-[#71bc44]/5"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-[#333] dark:text-[#e0e0e0] text-sm px-2">
                  {currentPage} / {Math.ceil((recentOrders?.length || 0) / ordersPerPage)}
                </span>
                                <Button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil((recentOrders?.length || 0) / ordersPerPage)}
                                    variant="outline"
                                    size="sm"
                                    className="border-[#71bc44]/20 text-[#71bc44] hover:bg-[#71bc44]/5"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enterprises Section - Right Side */}
                    <Card className="lg:col-span-1 bg-white dark:bg-[#2a2a2a] shadow-md overflow-hidden border-none">
                        <div className="h-1 bg-gradient-to-r from-[#71bc44]/50 to-[#71bc44]"></div>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-[#333] dark:text-[#e0e0e0]">Enterprise(s)</CardTitle>
                                    <CardDescription className="text-[#666] dark:text-[#999]">
                                        You have {agencies?.length} associated enterprises.
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#71bc44]/20 text-[#71bc44] hover:bg-[#71bc44]/5 hover:text-[#71bc44]"
                                >
                                    <Users className="h-4 w-4 mr-1" />
                                    All Enterprises
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="space-y-3">
                                {agencies?.map((agency: any) => (
                                    <div
                                        key={agency._id}
                                        className="group relative overflow-hidden rounded-lg bg-white dark:bg-[#2a2a2a] border border-[#71bc44]/10 hover:border-[#71bc44]/30 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#71bc44]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-[#71bc44]/10 animate-ping opacity-30 group-hover:opacity-70"></div>
                                                    <Avatar className="h-10 w-10 ring-2 ring-[#71bc44]/20">
                                                        <AvatarImage src={agency.imageUrl || "/placeholder.svg"} alt={agency?.company} />
                                                        <AvatarFallback className="bg-[#71bc44]/10 text-[#71bc44]">
                                                            {agency.company?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-[#333] dark:text-[#e0e0e0]">{agency?.company}</p>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-[#71bc44] hover:bg-[#71bc44]/10"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-[#666] dark:text-[#999]">{agency.branch}</p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center justify-center bg-[#71bc44]/5 rounded-md px-3 py-1.5">
                                                        <span className="text-xs text-[#666] dark:text-[#999]">Users</span>
                                                        <span className="text-lg font-bold text-[#71bc44]">{agency.users?.length}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center bg-[#71bc44]/5 rounded-md px-3 py-1.5">
                                                        <span className="text-xs text-[#666] dark:text-[#999]">Orders</span>
                                                        <span className="text-lg font-bold text-[#71bc44]">
                              {vendor.orders?.filter((order: any) => order.user?.agency?._id === agency._id).length ||
                                  0}
                            </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs border-[#71bc44]/20 text-[#71bc44] hover:bg-[#71bc44]/5"
                                                >
                                                    Details
                                                </Button>
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
