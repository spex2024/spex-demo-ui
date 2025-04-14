"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
    Menu,
    MapPin,
    Package2,
    UsersIcon,
    CreditCard,
    HelpCircle,
    LogOut,
    Settings,
    KeySquareIcon,
    ChevronDown,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAuth from "@/hook/auth"
import { useUserStore } from "@/store/profile"
import NotificationBell from "@/components/page/notification"

interface User {
    imageUrl?: string
    company?: string
    location?: string
    code?: string
    token?: string
    subscription?: {
        plan: string
    }
}

interface UserStore {
    user?: User
    fetchUser: () => Promise<void>
}

const navItems = [
    { href: "/", label: "Dashboard", icon: Package2 },
    { href: "/employees", label: "Employees", icon: UsersIcon },
    { href: "/vendors", label: "Vendors", icon: CreditCard },
    { href: "/orders", label: "Orders", icon: Package2 },
    { href: "/subscribe", label: "Subscription", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
]

export default function Component() {
    const { logout, success, error } = useAuth()
    const router = useRouter()
    const { user, fetchUser } = useUserStore() as UserStore
    const { company, imageUrl, location, code, subscription } = user ?? {}

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    useEffect(() => {
        fetchUser().finally(() => setLoading(false))
    }, [fetchUser])

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    const getPlanBadgeVariant = (plan: string | undefined) => {
        switch (plan?.toLowerCase()) {
            case "gold":
                return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-medium shadow-sm"
            case "bronze":
                return "bg-gradient-to-r from-amber-700 to-amber-800 text-white font-medium shadow-sm"
            case "silver":
                return "bg-gradient-to-r from-gray-300 to-gray-400 text-black font-medium shadow-sm"
            default:
                return "bg-gradient-to-r from-gray-100 to-gray-200 text-black font-medium shadow-sm"
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-16">Loading...</div>
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-90">
                            <Image
                                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                                alt="Spex Africa"
                                width={90}
                                height={90}
                                priority
                                className="h-10 w-auto"
                            />
                        </Link>
                        <nav className="hidden md:flex space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground transition-all hover:text-primary flex items-center px-3 py-2 rounded-md hover:bg-accent/50 relative group"
                                >
                                    <item.icon className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                                    {item.label}
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#71bc44] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="transition-transform hover:scale-105">
                            <NotificationBell />
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden rounded-full h-9 w-9 transition-colors hover:bg-accent/80"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="border-r border-border/40">
                                <div className="flex flex-col h-full">
                                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-6 mt-2">
                                        <Image
                                            src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                                            alt="Spex Africa"
                                            width={70}
                                            height={70}
                                            priority
                                            className="h-8 w-auto"
                                        />
                                    </Link>
                                    <nav className="grid gap-2 text-base font-medium">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center text-muted-foreground transition-colors hover:text-foreground p-2 rounded-md hover:bg-accent/50"
                                            >
                                                <item.icon className="h-5 w-5 mr-3" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto pt-6 border-t border-border/40">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100/20 p-2"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-3 h-5 w-5" />
                                            Log out
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-2 rounded-full hover:bg-accent/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 p-1 pl-2 h-auto"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 border-2 border-primary/10 transition-transform hover:scale-105">
                                            <AvatarImage src={imageUrl || "/placeholder.svg"} alt={company ?? "User"} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {company?.charAt(0) ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:flex flex-col items-start">
                                            <span className="text-sm font-medium leading-none">{company ?? "No company"}</span>
                                            <span className="text-xs text-muted-foreground">{subscription?.plan ?? "No plan"}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                                    </div>
                                    <span className="sr-only">Open user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border border-border/40 shadow-lg">
                                <div className="p-2 mb-1">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{company ?? "No company"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{code}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <div className="p-2 space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground p-1">
                                        <MapPin className="h-4 w-4 text-muted-foreground/70" />
                                        <span>{location ?? "No location"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-1">
                                        <Badge className={`${getPlanBadgeVariant(subscription?.plan)} px-2 py-0.5 text-xs font-medium`}>
                                            {subscription?.plan ?? "No plan"}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <div className="p-1">
                                    <DropdownMenuItem
                                        onSelect={() => router.push("/settings")}
                                        className="p-2 focus:bg-accent rounded-md cursor-pointer transition-colors"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => router.push("/password/request")}
                                        className="p-2 focus:bg-accent rounded-md cursor-pointer transition-colors"
                                    >
                                        <KeySquareIcon className="mr-2 h-4 w-4" />
                                        <span>Password Reset</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => router.push("/support")}
                                        className="p-2 focus:bg-accent rounded-md cursor-pointer transition-colors"
                                    >
                                        <HelpCircle className="mr-2 h-4 w-4" />
                                        <span>Support</span>
                                    </DropdownMenuItem>
                                </div>
                                <DropdownMenuSeparator className="bg-border/40" />
                                <DropdownMenuItem
                                    onSelect={handleLogout}
                                    className="p-2 focus:bg-red-100/20 rounded-md text-red-600 hover:text-red-700 cursor-pointer transition-colors"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
