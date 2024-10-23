'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { CircleArrowLeft, CircleArrowRight, CircleMinusIcon, File, ListFilter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserStore } from "@/store/profile"
import useAuth from "@/hook/auth"

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
    _id: string
}

interface UserState {
    user?: {
        users?: User[]
        _id?: string
    } | null
    loading: boolean
    error: string | null
    fetchUser: () => Promise<void>
}

export default function EmployeeData() {
    const { user, fetchUser } = useUserStore() as UserState
    const { disConnectUser, success, error } = useAuth()
    const [currentPage, setCurrentPage] = useState(1)
    const [filter, setFilter] = useState("all")
    const itemsPerPage = 10

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

    const users = user?.users || []
    const filteredUsers = users.filter((user) => {
        if (filter === "all") return true
        if (filter === "active") return user.isVerified
        if (filter === "inactive") return !user.isVerified
        return true
    })

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleDelete = async (entId: string, userId: string) => {
        await disConnectUser(entId, userId)
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <div className="container mx-auto py-6">
                <Tabs defaultValue="all" onValueChange={(value) => setFilter(value)}>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                        <TabsList className="mb-4 sm:mb-0">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        </TabsList>
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
                                        <ListFilter className="h-4 w-4 lg:mr-2" />
                                        <span className="hidden lg:inline">Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem checked={filter === "active"} onCheckedChange={() => setFilter("active")}>
                                        Active
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem checked={filter === "inactive"} onCheckedChange={() => setFilter("inactive")}>
                                        Inactive
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button size="sm" variant="outline" className="h-8 px-2 lg:px-3">
                                <File className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Export</span>
                            </Button>
                        </div>
                    </div>
                    <TabsContent value="all">
                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage your users and view their information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                                                <TableHead>Points</TableHead>
                                                <TableHead className="hidden sm:table-cell">Code</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden xl:table-cell">Created At</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedUsers.map((userItem) => (
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
                                                    <TableCell className="font-medium">
                                                        {userItem.firstName} {userItem.lastName}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">{userItem.email}</TableCell>
                                                    <TableCell className="hidden lg:table-cell">{userItem.phone}</TableCell>
                                                    <TableCell>{userItem.points.toFixed(2)}</TableCell>
                                                    <TableCell className="hidden sm:table-cell">{userItem.code}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={userItem.isVerified ? "outline" : "secondary"}>
                                                            {userItem.isVerified ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden xl:table-cell">
                                                        {format(new Date(userItem.createdAt), 'MMM d, yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 p-0"
                                                                        onClick={() => handleDelete(user?._id as string, userItem._id)}
                                                                    >
                                                                        <CircleMinusIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Remove user</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                                <div className="text-sm text-muted-foreground">
                                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong> users
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <CircleArrowLeft size={16} className="mr-2" />
                                        Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next
                                        <CircleArrowRight size={16} className="ml-2" />
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