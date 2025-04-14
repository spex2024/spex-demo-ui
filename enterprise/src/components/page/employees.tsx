"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { CircleArrowLeft, CircleArrowRight, CircleMinusIcon, File, ListFilter, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    const [searchTerm, setSearchTerm] = useState("")
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
        const matchesFilter = filter === "all" ? true : filter === "active" ? user.isVerified : !user.isVerified

        const matchesSearch =
            searchTerm === "" ||
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.code.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesFilter && matchesSearch
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
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto py-8 px-4">
                <Tabs
                    defaultValue="all"
                    onValueChange={(value) => {
                        setFilter(value)
                        setCurrentPage(1)
                    }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                        <div className="w-full sm:w-auto mb-4 sm:mb-0">
                            <TabsList className="bg-white border shadow-sm rounded-xl p-1">
                                <TabsTrigger
                                    value="all"
                                    className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#71bc44] data-[state=active]:text-white transition-all duration-200"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger
                                    value="active"
                                    className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#71bc44] data-[state=active]:text-white transition-all duration-200"
                                >
                                    Active
                                </TabsTrigger>
                                <TabsTrigger
                                    value="inactive"
                                    className="rounded-lg px-6 py-2.5 data-[state=active]:bg-[#71bc44] data-[state=active]:text-white transition-all duration-200"
                                >
                                    Inactive
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-10 border-gray-200 bg-white rounded-lg focus-visible:ring-[#71bc44] focus-visible:ring-offset-0 focus-visible:border-[#71bc44]"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 px-4 border-gray-200 bg-white hover:bg-gray-50 hover:text-[#71bc44]"
                                        >
                                            <ListFilter className="h-4 w-4 mr-2" />
                                            <span>Filter</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 border-none shadow-lg rounded-xl p-2">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem checked={filter === "active"} onCheckedChange={() => setFilter("active")}>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={filter === "inactive"}
                                            onCheckedChange={() => setFilter("inactive")}
                                        >
                                            Inactive
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-10 px-4 border-gray-200 bg-white hover:bg-gray-50 hover:text-[#71bc44]"
                                >
                                    <File className="h-4 w-4 mr-2" />
                                    <span>Export</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Card className="border-none rounded-xl shadow-lg overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-[#71bc44]/90 to-[#71bc44]/70 text-white">
                            <CardTitle>Employee Directory</CardTitle>
                            <CardDescription className="text-white/80">
                                Manage your team members and view their information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-gray-50">
                                        <TableRow className="border-b border-gray-100">
                                            <TableHead className="w-[100px] py-4">Image</TableHead>
                                            <TableHead className="py-4">Name</TableHead>
                                            <TableHead className="hidden md:table-cell py-4">Email</TableHead>
                                            <TableHead className="hidden lg:table-cell py-4">Phone</TableHead>
                                            <TableHead className="py-4">Points</TableHead>
                                            <TableHead className="hidden sm:table-cell py-4">Code</TableHead>
                                            <TableHead className="py-4">Status</TableHead>
                                            <TableHead className="hidden xl:table-cell py-4">Created At</TableHead>
                                            <TableHead className="py-4">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedUsers.length > 0 ? (
                                            paginatedUsers.map((userItem, index) => (
                                                <TableRow
                                                    key={userItem.code}
                                                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                                >
                                                    <TableCell className="py-3">
                                                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#71bc44]/20 shadow-sm">
                                                            <Image
                                                                alt="User image"
                                                                className="object-cover"
                                                                fill
                                                                src={userItem.imageUrl || "/placeholder.svg"}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex flex-col">
                              <span className="text-gray-900">
                                {userItem.firstName} {userItem.lastName}
                              </span>
                                                            <span className="text-xs text-gray-500 md:hidden">{userItem.email}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-gray-600">{userItem.email}</TableCell>
                                                    <TableCell className="hidden lg:table-cell text-gray-600">{userItem.phone}</TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold text-[#71bc44]">{userItem.points.toFixed(2)}</div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell font-mono text-xs text-gray-500">
                                                        {userItem.code}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                userItem.isVerified
                                                                    ? "bg-[#71bc44]/10 text-[#71bc44] border-[#71bc44]/20 hover:bg-[#71bc44]/20"
                                                                    : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                                                            }
                                                        >
                              <span
                                  className={`mr-1.5 h-2 w-2 rounded-full ${userItem.isVerified ? "bg-[#71bc44]" : "bg-gray-400"}`}
                              ></span>
                                                            {userItem.isVerified ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden xl:table-cell text-gray-500 text-sm">
                                                        {format(new Date(userItem.createdAt), "MMM d, yyyy")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                        onClick={() => handleDelete(user?._id as string, userItem._id)}
                                                                    >
                                                                        <CircleMinusIcon size={18} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="left" className="bg-gray-800 text-white border-none">
                                                                    <p className="text-xs">Remove user</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 border-t py-5 bg-gray-50/50">
                            <div className="text-sm text-gray-500">
                                Showing{" "}
                                <strong>
                                    {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                                </strong>{" "}
                                of <strong>{filteredUsers.length}</strong> users
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="h-10 px-4 border-gray-200 bg-white hover:bg-gray-50 hover:text-[#71bc44] disabled:opacity-50"
                                >
                                    <CircleArrowLeft size={16} className="mr-2" />
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="h-10 px-4 border-gray-200 bg-white hover:bg-gray-50 hover:text-[#71bc44] disabled:opacity-50"
                                >
                                    Next
                                    <CircleArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </Tabs>
            </div>
        </div>
    )
}
