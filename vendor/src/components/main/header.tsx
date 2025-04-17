"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Menu, Package2, MapPin, Home, PlusCircle, ShoppingBag, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuth from "@/app/hook/auth"
import { useRouter, usePathname } from "next/navigation"
import toast from "react-hot-toast"
import Image from "next/image"
import useVendorStore from "@/app/store/vendor"
import NotificationBell from "@/components/main/notification"

const Header = () => {
    const { logout, success, error } = useAuth()
    const { vendor, fetchVendor } = useVendorStore()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    useEffect(() => {
        fetchVendor()
    }, [fetchVendor])

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    console.log(vendor)

    const navItems = [
        { href: "/", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
        { href: "/pages/add-meal", label: "Add meal", icon: <PlusCircle className="h-4 w-4" /> },
        { href: "/pages/product", label: "Meals", icon: <ShoppingBag className="h-4 w-4" /> },
        { href: "/pages/orders", label: "Orders", icon: <Package2 className="h-4 w-4" /> },
        { href: "/pages/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src={"https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"}
                                alt={"spex africa"}
                                width={70}
                                height={70}
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                        isActive ? "text-white bg-[#71bc44]" : "text-gray-700 hover:bg-[#e6f4e0] hover:text-[#71bc44]"
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden border-[#71bc44] text-[#71bc44]">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                            <div className="flex items-center mb-6">
                                <Link href="/" className="flex items-center gap-2">
                                    <Image
                                        src={"https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"}
                                        alt={"spex africa"}
                                        width={70}
                                        height={70}
                                    />
                                </Link>
                            </div>
                            <nav className="grid gap-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                                isActive ? "text-white bg-[#71bc44]" : "text-gray-700 hover:bg-[#e6f4e0] hover:text-[#71bc44]"
                                            }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        <NotificationBell />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="h-9 w-9 rounded-full p-0 overflow-hidden border-2 border-[#71bc44] shadow-sm transition-all hover:shadow-md"
                                    style={{
                                        backgroundImage: vendor?.imageUrl ? `url(${vendor?.imageUrl})` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    {!vendor?.imageUrl && (
                                        <span className="text-[#71bc44] font-semibold">{vendor?.name?.charAt(0) || "U"}</span>
                                    )}
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">{vendor?.name || "User"}</p>
                                        <p className="text-xs text-muted-foreground">{vendor?.code || "No code"}</p>
                                        {vendor?.location && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                <MapPin size={10} strokeWidth={2} className="text-[#71bc44]" />
                                                {vendor.location}
                                            </p>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/pages/settings" className="flex w-full">
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
