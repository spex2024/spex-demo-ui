'use client'

import Image from "next/image";
import {CircleArrowLeft, CircleArrowRight, CircleMinusIcon, File, ListFilter, TrashIcon} from "lucide-react";
import { format, isValid } from "date-fns";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useUserStore } from "@/store/profile";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {AddVendor} from "@/components/page/add-vendor";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import useAuth from "@/hook/auth";
import {toast} from "react-hot-toast";

// Define types for user data
interface User {
    imageUrl: string | StaticImport;
    name: string;
    email: string;
    points: number;
    code: string;
    orders:[];
    createdAt: string; // Assuming ISO date string
    phone: string;
    isVerified: boolean;
    totalSales: number;
    _id:string;
}

interface UserState {
    user: {
        vendors: User[]; // Sub-array of users
        _id:string
    };
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

export default function Vendors() {
    const { user, fetchUser } = useUserStore() as UserState;
    const { vendors } = user || {}; // Use default empty object if user is null
    const { disConnectVendor, success, error } = useAuth();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    // Calculate paginated data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVendors = vendors?.slice(indexOfFirstItem, indexOfLastItem) || [];

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Total pages calculation
    const totalPages = Math.ceil((vendors?.length || 0) / itemsPerPage);

    const handleDelete = async (userId: string , vendorId: string) => {
        console.log(userId , vendorId)
        await disConnectVendor(userId ,vendorId);
    };



    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Inactive</TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <AddVendor/>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-10 bg-black text-white px-3 flex items-center gap-2">
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem>
                                            Active
                                        </DropdownMenuCheckboxItem>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" variant="outline" className="h-10 bg-black text-white px-3 flex items-center gap-2">
                                    <File className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Export
                                    </span>
                                </Button>
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>Vendors</CardTitle>
                                    <CardDescription>
                                        Manage your vendors and view their information.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="hidden w-[100px] sm:table-cell">
                                                    <span className="">Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Total Sales</TableHead>
                                                <TableHead>Total Orders</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Status
                                                </TableHead>
                                                <TableHead className="hidden md:table-cell">
                                                    Created At
                                                </TableHead><TableHead className="hidden md:table-cell">
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentVendors.map((userItem) => {
                                                const createdAtDate = new Date(userItem.createdAt);
                                                const formattedDate = isValid(createdAtDate)
                                                    ? format(createdAtDate, 'MMM d, yyyy')
                                                    : 'N/A';

                                                return (
                                                    <TableRow key={userItem.code}>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Image
                                                                alt="User image"
                                                                className="aspect-square rounded-md object-cover"
                                                                height={64}
                                                                src={userItem.imageUrl}
                                                                width={64}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {userItem.name}
                                                        </TableCell>
                                                        <TableCell>{userItem.email}</TableCell>
                                                        <TableCell>{userItem.phone}</TableCell>
                                                        <TableCell> GH₵ {userItem.totalSales}</TableCell>
                                                        <TableCell>{userItem.orders.length}</TableCell>
                                                        <TableCell>{userItem.code}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={userItem.isVerified ? "outline" : "secondary"}>
                                                                {userItem.isVerified ? "Active" : "Inactive"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {formattedDate}
                                                        </TableCell>
                                                        <TableCell>
                                                            <TooltipProvider>
                                                                <div className="flex items-center space-x-2 cursor-pointer">


                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 p-0"
                                                                                onClick={() => handleDelete(user._id, userItem._id)}
                                                                            >
                                                                                <CircleMinusIcon size={16}/>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>

                                                                           <p className={`text-xs`}>remove vendor</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </TooltipProvider>
                                                        </TableCell>

                                                    </TableRow>
                                                );
                                            })}


                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className={`w-full`}>
                                    <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                                        <div>
                                            Showing <strong>{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, vendors?.length)}</strong> of <strong>{vendors?.length}</strong> vendors
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={`flex gap-x-2 items-center`}
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}

                                            >
                                               <CircleArrowLeft size={20} strokeWidth={1}/> Previous
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className={`flex gap-x-2 items-center`}

                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                Next       <CircleArrowRight size={20} strokeWidth={1}/>
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
