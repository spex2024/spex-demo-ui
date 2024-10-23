'use client'


import { CircleArrowLeft, CircleArrowRight, File, ListFilter } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserStore } from "@/store/profile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Meal {
    main: string
    protein?: string
    sauce?: string
    extras?: string
}

interface Vendor {
    name: string
}

interface Order {
    orderId: string
    meals: Meal[]
    quantity: number
    status: string
    createdAt: string
    user: {
        firstName: string
        lastName: string
    }
    vendor: Vendor
}

interface User {
    imageUrl: string
    firstName: string
    lastName: string
    email: string
    points: number
    code: string
    createdAt: string
    phone: string
    isVerified: boolean
    orders: Order[]
}

interface UserState {
    user: {
        users: User[]
    } | null
    loading: boolean
    error: string | null
    fetchUser: () => Promise<void>
}

export default function Component() {
    const { user, fetchUser } = useUserStore() as UserState
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 10

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    const users = user?.users || []
    const orders = users.flatMap(user => user.orders)

    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder)
    const totalPages = Math.ceil(orders.length / ordersPerPage)

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="all" className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <TabsList className="bg-white shadow rounded-lg">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                        <div className="flex flex-wrap items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="bg-white text-gray-700">
                                        <ListFilter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" variant="outline" className="bg-white text-gray-700">
                                <File className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="all">
                        <Card>
                            <CardHeader>
                                <CardTitle>Orders</CardTitle>
                                <CardDescription>Manage your orders and view their information.</CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Vendor</TableHead>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Meal</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ordered By</TableHead>
                                            <TableHead className="hidden md:table-cell">Created At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentOrders.map((order) => (
                                            <TooltipProvider delayDuration={300} key={order.orderId}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TableRow  className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                                                            <TableCell className="font-medium">{order.vendor.name}</TableCell>
                                                            <TableCell>{order.orderId}</TableCell>
                                                            <TableCell>{order.meals.map(meal => meal.main).join(", ")}</TableCell>
                                                            <TableCell>{order.quantity}</TableCell>
                                                            <TableCell>
                                                                <Badge className={
                                                                    `flex justify-center bg-transparent text-sm items-center hover:bg-transparent
    ${order.status === 'completed' ? " text-green-500" :
                                                                        order.status === 'pending' ? " text-yellow-500" :
                                                                            " text-red-500"}`
                                                                }>
                                                                    {order.status}
                                                                </Badge>

                                                            </TableCell>
                                                            <TableCell className="">
                                                                {order.user.firstName} {order.user.lastName}
                                                            </TableCell>
                                                            <TableCell className="">
                                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="p-0 w-80">
                                                        <div className="text-black bg-white rounded-lg shadow-lg overflow-hidden">
                                                            <div className="px-4 py-3 bg-[#5da438] border-b border-white">
                                                                <h3 className="font-semibold text-white">Order Details</h3>
                                                            </div>
                                                            <div className="p-4">
                                                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                                                <p><strong>Vendor:</strong> {order.vendor.name}</p>
                                                                <p><strong>Customer:</strong> {order.user.firstName} {order.user.lastName}</p>
                                                                <p className="mt-2"><strong>Meals:</strong></p>
                                                                {order.meals.map((meal, index) => (
                                                                    <ul key={index} className="list-disc pl-5 mt-1">
                                                                        <li>{meal.main}</li>
                                                                        <li>{meal.protein}</li>
                                                                        <li>{meal.sauce}</li>
                                                                        <li>{meal.extras}</li>
                                                                    </ul>
                                                                ))}
                                                                <p className="mt-2"><strong>Quantity:</strong> {order.quantity}</p>
                                                                <p><strong>Status:</strong> {order.status}</p>
                                                                <p><strong>Created At:</strong> {format(new Date(order.createdAt), 'MMM d, yyyy')}</p>
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <div className="text-sm text-muted-foreground">
                                    Showing <strong>{indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)}</strong> of <strong>{orders.length}</strong> orders
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                                    >
                                        <CircleArrowLeft size={16} className="mr-2" /> Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                                    >
                                        Next <CircleArrowRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}