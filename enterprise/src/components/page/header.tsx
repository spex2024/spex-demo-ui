'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleUser, MapPin, Menu, Package2, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useAuth from '@/hook/auth';
import { useUserStore } from '@/store/profile';
import Image from 'next/image';
import { UsersIcon } from "lucide-react";
import useAuthStore from "@/store/authenticate";

// Define the type for the user object
interface User {
    imageUrl?: string;
    company?: string;
    location?: string;
    code?: string;
    token?: string; // Include token in the user type
}

// Define the type for useUserStore
interface UserStore {
    user?: User;
    fetchUser: () => Promise<void>;
}



// Define the component with type checking
const Header: React.FC = () => {
    const { logout, success, error } = useAuth();
    const router = useRouter();
    const { isAuthenticated, isLoading, logout: clear } = useAuthStore();
    const { user, fetchUser } = useUserStore() as UserStore; // Casting to UserStore
    const { company, imageUrl, location, code, token } = user ?? {};

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);

    useEffect(() => {
        fetchUser().finally(() => setLoading(false));
    }, [fetchUser]);

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         router.push('/login'); // Redirect to login page if not authenticated
    //     }
    // }, [isAuthenticated, router]);


    const handleLogout = async () => {
        await logout();
        clear();
        router.push('/login'); // Redirect to the login page after logout
    };

    if (!isAuthenticated) return null;

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    <Image src={'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'} alt={'spex africa'} width={70} height={70}/>
                </Link>
                <Link href="/" className="text-foreground transition-colors hover:text-foreground">
                    Dashboard
                </Link>
                <Link href="/employees" className="text-muted-foreground transition-colors hover:text-foreground">
                    Employees
                </Link>
                <Link href={'/vendors'} className="text-muted-foreground transition-colors hover:text-foreground">
                    Vendors
                </Link>
                <Link href={'/orders'} className="text-muted-foreground transition-colors hover:text-foreground">
                    Orders
                </Link>
                <Link href={'/add-vendor'} className="text-muted-foreground transition-colors hover:text-foreground">
                    Analytics
                </Link>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link href="#" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            Orders
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            Products
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            Customers
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            Analytics
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full border-2 border-black">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt="Profile picture"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                            ) : (
                                <UsersIcon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`w-52`}>
                        <DropdownMenuLabel className={`w-full flex flex-col gap-2`}>
                            <p>
                                {company ?? 'No company'} ({code})
                            </p>
                            <p className={`w-full flex items-center gap-2 font-light`}>
                                <MapPin size={12} strokeWidth={1} /> {location}
                            </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
