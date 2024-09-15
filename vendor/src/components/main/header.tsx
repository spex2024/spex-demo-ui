'use client'


import React, {useEffect} from 'react';
import Link from "next/link";
import { Menu, Package2, Search} from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {MapPin} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useAuth from "@/app/hook/auth";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

import useAuthStore from "@/app/store/authenticate";
import useVendorStore from "@/app/store/vendor";


const Header = () => {
    const {logout , success,error} = useAuth()
    const {vendor,fetchVendor} =useVendorStore()
    const router = useRouter()
    const { isAuthenticated, isLoading, logout:clear } = useAuthStore();
    useEffect(() => {
        if (success) {
            toast.success(success);
        } else if (error) {
            toast.error(error);
        }
    }, [success, error]);
    useEffect(() => {

        if (isAuthenticated) {
            fetchVendor()
        }

    }, [isAuthenticated, fetchVendor]);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login'); // Redirect to login page if not authenticated
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        await logout();
        clear()
        router.push('/login'); // Redirect to the login page after logout
    };


 if (!isAuthenticated) return null;

    return (

        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav
                className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6  w-[70vw] py-3">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Image src={'https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png'} alt={'spex africa'} width={70} height={70}/>
                </Link>
                <Link
                    href={"/"}
                    className="text-foreground transition-colors hover:text-foreground"
                >
                    Dashboard
                </Link>

                <Link
                    href={'/pages/add-meal'}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Add meal
                </Link>
                <Link
                    href={'/pages/product'}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Meals
                </Link>
                <Link
                    href={'/pages/orders'}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                >
                    Profile
                </Link>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6"/>
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link href="#" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Orders
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Products
                        </Link>
                        <Link
                            href={'/pages/add-meal'}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Add Meal
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Analytics
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex flex-1 w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size='default' className="rounded border-2 border-black dark:border-gray-300" style={{backgroundImage: `url(${vendor?.imageUrl})`, backgroundSize: 'cover', backgroundPosition:'center'}}>

                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{vendor?.name}</p>
                                <p className="text-sm text-muted-foreground font-light">{vendor?.code}</p>
                                <p className="text-sm text-muted-foreground flex gap-1 items-center font-light"><MapPin size={12} strokeWidth={2} />{vendor?.location}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator/>

                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>

    );
};

export default Header;