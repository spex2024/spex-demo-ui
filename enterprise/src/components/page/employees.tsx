'use client'

import Image from "next/image";
import {
    CircleArrowLeft,
    CircleArrowRight, CircleMinusIcon,
    File,
    ListFilter,
} from "lucide-react";
import { format } from "date-fns";

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
import { useEffect, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import useAuth from "@/hook/auth";
import {toast} from "react-hot-toast";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

// Define types for user data
interface User {
    imageUrl: string | StaticImport;
    firstName: string;
    lastName: string;
    email: string;
    points: number;
    code: string;
    createdAt: string; // Assuming ISO date string
    phone: string;
    isVerified: boolean;
    _id:string;


}

interface UserState {
    user?: {
        users?: User[];
        _id?:string
        // Sub-array of users
    } | null; // Handle possible null value
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
}

export default function EmployeeData() {
    const { user, fetchUser } = useUserStore() as UserState;
    const { disConnectUser, success, error } = useAuth();
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
    // Handle case where user might be null
    const users = user?.users || [];

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate paginated users
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleDelete = async (entId: string , userId: string) => {
        console.log(entId , userId)
        await disConnectUser(entId ,userId);
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuCheckboxItem checked>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Archived
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" variant="outline" className="h-7 gap-1">
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
                                    <CardTitle>Users</CardTitle>
                                    <CardDescription>
                                        Manage your users and view their information.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    <span>Image</span>
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Points</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead>
                                                    Status
                                                </TableHead>
                                                <TableHead >
                                                    Created At
                                                </TableHead>
                                                <TableHead>
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedUsers.map((userItem) => (
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
                                                        {userItem.firstName} {userItem.lastName}
                                                    </TableCell>
                                                    <TableCell>{userItem.email}</TableCell>
                                                    <TableCell>{userItem.phone}</TableCell>
                                                    <TableCell>{userItem.points}</TableCell>
                                                    <TableCell>{userItem.code}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={userItem.isVerified ? "outline" : "secondary"}>
                                                            {userItem.isVerified ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        {format(new Date(userItem.createdAt), 'MMM d, yyyy')}
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
                                                                            onClick={() => handleDelete(user?._id as string, userItem._id)}
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
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter className={`w-full`}>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="text-xs text-muted-foreground">
                                            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, users.length)}</strong> of <strong>{users.length}</strong> users
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                disabled={currentPage === 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                <CircleArrowLeft size={20} strokeWidth={1} />Previous
                                            </Button>
                                            <Button
                                                size="sm"
                                                className={`flex items-center gap-x-2`}
                                                variant="ghost"
                                                disabled={currentPage === totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                Next <CircleArrowRight size={20} strokeWidth={1} />
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
