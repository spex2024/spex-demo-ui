'use client'

import React, { useState, useMemo } from "react"
import Image from "next/image"
import {
    CircleArrowLeft,
    CircleArrowRight,
    FileDown,
    ListFilter,
    CheckCircle,
    XCircle,
    FileSpreadsheet,
    Trash
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format, isToday, parseISO } from 'date-fns'
import { utils, write } from 'xlsx'
import useAuth from "@/app/hook/auth";
import toast from "react-hot-toast";


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

interface OrderTableProps {
    orders: Order[]
}



export default function OrderTable({ orders }: OrderTableProps) {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)
    const [activeTab, setActiveTab] = useState("today")
    const rowsPerPage = 5

    const {completeOrder , cancelOrder , success , error ,deleteOrder} = useAuth()

    const todayOrders = useMemo(() => orders.filter(order => isToday(parseISO(order.createdAt))), [orders])
    const pendingOrders = useMemo(() => orders.filter(order => order.status === 'pending'), [orders])
    const completedOrders = useMemo(() => orders.filter(order => order.status === 'completed'), [orders])
    const cancelledOrders = useMemo(() => orders.filter(order => order.status === 'cancelled'), [orders])

    const getFilteredOrders = () => {
        switch (activeTab) {
            case 'today': return todayOrders
            case 'pending': return pendingOrders
            case 'completed': return completedOrders
            case 'cancelled': return cancelledOrders
            default: return orders
        }
    }

    const filteredOrders = getFilteredOrders()
    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage)
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)


    const generateExcel = () => {
        setIsGeneratingExcel(true)
        try {
            const worksheet = utils.json_to_sheet(orders.map(order => ({
                'Order ID': order.orderId,
                'Meal': order.mealName,
                'Customer': `${order.user.firstName} ${order.user.lastName}`,
                'Vendor': order.vendor.name,
                'Status': order.status,
                'Price': order.price,
                'Quantity': order.quantity,
                'Total': order.price * order.quantity,
                'Created At': format(parseISO(order.createdAt), 'MMM dd, yyyy'),
                'Protein': order.options.protein,
                'Sauce': order.options.sauce,
                'Extras': order.options.extras.join(', '),
                'Selected Days': order.selectedDays.join(', ')
            })))
            const workbook = utils.book_new()
            utils.book_append_sheet(workbook, worksheet, 'Orders')
            const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' })
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'all_orders.xlsx'
            link.click()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error generating Excel:', error)
        } finally {
            setIsGeneratingExcel(false)
        }
    }

    const handleComplete = async (orderId: string) => {
        try {
            await completeOrder(orderId);
            toast.success("Order completed successfully!");
        } catch (err) {
            toast.error("Failed to complete the order. Please try again.");
        }
    };

    const handleCancel = async (orderId: string) => {
        try {
            await cancelOrder(orderId);
            toast.success("Order cancelled successfully!");
        } catch (err) {
            toast.error("Failed to cancel the order. Please try again.");
        }
    };
    const handleDeleteOrder = async (orderId: string) => {
        try {
            await deleteOrder(orderId);
            toast.success("Order cancelled successfully!");
        } catch (err) {
            toast.error("Failed to cancel the order. Please try again.");
        }
    };
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="today" onValueChange={setActiveTab}>
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="today">Daily Orders</TabsTrigger>
                                <TabsTrigger value="all">All Orders</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="cancelled" className="hidden sm:flex">
                                    Cancelled
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem>Pending</DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Completed</DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Cancelled</DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1"
                                    // onClick={() => generatePDF(filteredOrders, `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`)}
                                    disabled={isGeneratingPDF}
                                >
                                    <FileDown className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                  </span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1"
                                    onClick={generateExcel}
                                    disabled={isGeneratingExcel}
                                >
                                    <FileSpreadsheet className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {isGeneratingExcel ? 'Generating Excel...' : 'Export Excel'}
                  </span>
                                </Button>
                            </div>
                        </div>
                        {['today', 'all', 'pending', 'completed', 'cancelled'].map((tab) => (
                            <TabsContent key={tab} value={tab}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{tab === 'today' ? "Daily Orders" : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Orders`}</CardTitle>
                                        <CardDescription>Manage your orders and view their status.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <TooltipProvider>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-[100px]">Image</TableHead>
                                                            <TableHead>Order ID</TableHead>
                                                            <TableHead>Meal</TableHead>
                                                            <TableHead className="hidden md:table-cell">Vendor</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead>Price</TableHead>
                                                            <TableHead className="hidden sm:table-cell">Quantity</TableHead>
                                                            <TableHead className="hidden lg:table-cell">Created At</TableHead>
                                                            <TableHead className="hidden xl:table-cell">Ordered By</TableHead>
                                                            <TableHead>Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {paginatedOrders.map((order) => (
                                                            <Tooltip key={order.orderId}>
                                                                <TooltipTrigger asChild>
                                                                    <TableRow className="cursor-pointer">
                                                                        <TableCell>
                                                                            <Image
                                                                                alt="Order image"
                                                                                className="aspect-square rounded-md object-cover"
                                                                                height={64}
                                                                                src={order.imageUrl}
                                                                                width={64}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell className="font-medium">{order.orderId}</TableCell>
                                                                        <TableCell className="font-medium">{order.mealName}</TableCell>
                                                                        <TableCell className="hidden md:table-cell font-medium">{order.vendor.name}</TableCell>
                                                                        <TableCell>
                                                                            <Badge variant="outline">{order.status}</Badge>
                                                                        </TableCell>
                                                                        <TableCell>GH₵{order.price}</TableCell>
                                                                        <TableCell className="hidden sm:table-cell">{order.quantity}</TableCell>
                                                                        <TableCell className="hidden lg:table-cell">{format(parseISO(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                                                                        <TableCell className="hidden xl:table-cell">
                                                                            <div className="flex gap-2">
                                                                                <span>{order.user.firstName}</span>
                                                                                <span>{order.user.lastName}</span>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="flex space-x-2">
                                                                                {order.status === 'pending' ? (
                                                                                    <>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger asChild>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => handleComplete(order._id)}
                                                                                                >
                                                                                                    <CheckCircle className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent>
                                                                                                <p>Complete Order</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger asChild>
                                                                                                <Button
                                                                                                    size="sm"
                                                                                                    variant="outline"
                                                                                                    onClick={() => handleCancel(order._id)}
                                                                                                >
                                                                                                    <XCircle className="h-4 w-4" />
                                                                                                </Button>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent>
                                                                                                <p>Cancel Order</p>
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                    </>
                                                                                ):(
                                                                                    <TooltipProvider>
                                                                                    <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                    <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    onClick={() => handleDeleteOrder(order._id)}
                                                                            >
                                                                                <Trash className="h-4 w-4"/>
                                                                            </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent
                                                                    className={`flex flex-col items-center justify-center bg-white text-black border border-black`}>
                                                                    <h2 className={`font-bold`}>delete
                                                                        order</h2>

                                                                </TooltipContent>
                                                            </Tooltip>
                                                            </TooltipProvider>
                                                                                    )}
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="w-96 p-0 overflow-hidden rounded-lg shadow-lg" sideOffset={5}>
                                                                    <div className="bg-[#c7b72f] p-3 text-white">
                                                                        <h3 className="text-lg font-semibold mb-1">Order Details</h3>
                                                                        <p className="text-sm">Order ID: {order.orderId}</p>
                                                                    </div>
                                                                    <div className="p-3 bg-white text-gray-800">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {[
                                                                                { label: 'Meal', value: order.mealName },
                                                                                { label: 'Vendor', value: order.vendor.name },
                                                                                { label: 'Status', value: order.status },
                                                                                { label: 'Price', value: `GH₵${order.price}` },
                                                                                { label: 'Quantity', value: order.quantity },
                                                                                { label: 'Created At', value: format(parseISO(order.createdAt), 'MMM dd, yyyy') },
                                                                            ].map(({ label, value }) => (
                                                                                <div key={label}>
                                                                                    <p className="text-sm font-semibold text-[#71bc44]">{label}</p>
                                                                                    <p className="text-sm">{value}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <p className="text-sm font-semibold text-[#71bc44]">Ordered By</p>
                                                                            <p className="text-sm">{`${order.user.firstName} ${order.user.lastName}`}</p>
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <p className="text-sm font-semibold text-[#71bc44]">Selected Days</p>
                                                                            <p className="text-sm">{order.selectedDays.join(', ')}</p>
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <p className="text-sm font-semibold text-[#71bc44]">Options</p>
                                                                            <p className="text-sm">
                                                                                Protein: {order.options.protein},
                                                                                Sauce: {order.options.sauce},
                                                                                Extras: {order.options.extras.join(', ')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TooltipProvider>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-xs text-muted-foreground">
                                                Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong>-
                                                <strong>{Math.min(currentPage * rowsPerPage, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> orders
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex gap-2"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <CircleArrowLeft size={20} strokeWidth={1} /> Previous
                                                </Button>
                                                <Button
                                                    className="flex gap-2"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next <CircleArrowRight size={20} strokeWidth={1} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </main>
            </div>
        </div>
    )
}