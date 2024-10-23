'use client'

import Image from "next/image"
import { CircleArrowLeft, CircleArrowRight, CircleMinusIcon, File, ListFilter } from "lucide-react"
import { format, isValid } from "date-fns"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserStore } from "@/store/profile"
import { AddVendor } from "@/components/page/add-vendor"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useAuth from "@/hook/auth"
import { toast } from "react-hot-toast"

interface User {
    imageUrl: string
    name: string
    email: string
    points: number
    code: string
    orders: []
    createdAt: string
    phone: string
    isVerified: boolean
    totalSales: number
    _id: string
}

interface UserState {
    user: {
        vendors: User[]
        _id: string
    }
    loading: boolean
    error: string | null
    fetchUser: () => Promise<void>
}

export default function Component() {
    const { user, fetchUser } = useUserStore() as UserState
    const { vendors } = user || {}
    const { disConnectVendor, success, error } = useAuth()

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentVendors = vendors?.slice(indexOfFirstItem, indexOfLastItem) || []

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const totalPages = Math.ceil((vendors?.length || 0) / itemsPerPage)

    const handleDelete = async (userId: string, vendorId: string) => {
        await disConnectVendor(userId, vendorId)
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="all" className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <TabsList className="bg-white shadow rounded-lg">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="draft">Inactive</TabsTrigger>
                        </TabsList>
                        <div className="flex flex-wrap items-center gap-2">
                            <AddVendor />
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
                                    <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
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
                                <CardTitle>Vendors</CardTitle>
                                <CardDescription>Manage your vendors and view their information.</CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Image</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Total Sales</TableHead>
                                            <TableHead>Total Orders</TableHead>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Created At</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentVendors.map((userItem) => {
                                            const createdAtDate = new Date(userItem.createdAt)
                                            const formattedDate = isValid(createdAtDate) ? format(createdAtDate, 'MMM d, yyyy') : 'N/A'

                                            return (
                                                <TableRow key={userItem.code}>
                                                    <TableCell>
                                                        <Image
                                                            alt="User image"
                                                            className="aspect-square rounded-md object-cover"
                                                            height={40}
                                                            src={userItem.imageUrl}
                                                            width={40}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{userItem.name}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{userItem.email}</TableCell>
                                                    <TableCell className="hidden lg:table-cell">{userItem.phone}</TableCell>
                                                    <TableCell>GH₵ {userItem.totalSales}</TableCell>
                                                    <TableCell className="hidden xl:table-cell">{userItem.orders.length}</TableCell>
                                                    <TableCell className="hidden xl:table-cell">{userItem.code}</TableCell>
                                                    <TableCell>
                                                        <Badge className={userItem.isVerified ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
                                                            {userItem.isVerified ? "Active" : "Inactive"}
                                                        </Badge>

                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">{formattedDate}</TableCell>
                                                    <TableCell>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 p-0"
                                                                        onClick={() => handleDelete(user._id, userItem._id)}
                                                                    >
                                                                        <CircleMinusIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Remove vendor</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <div className="text-sm text-muted-foreground">
                                    Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, vendors?.length)}</strong> of <strong>{vendors?.length}</strong> vendors
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <CircleArrowLeft size={16} className="mr-2" /> Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
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