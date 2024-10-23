'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, MapPin, Package2, UsersIcon, CreditCard, HelpCircle, LogOut, Settings, KeySquareIcon, ChevronDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hook/auth'
import { useUserStore } from '@/store/profile'

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
    { href: '/', label: 'Dashboard', icon: Package2 },
    { href: '/employees', label: 'Employees', icon: UsersIcon },
    { href: '/vendors', label: 'Vendors', icon: CreditCard },
    { href: '/orders', label: 'Orders', icon: Package2 },
    { href: '/subscribe', label: 'Subscription', icon: CreditCard },
    { href: '/settings', label: 'Settings', icon: Settings },
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
        router.push('/login')
    }

    const getPlanBadgeVariant = (plan: string | undefined) => {
        switch (plan?.toLowerCase()) {
            case 'gold':
                return 'bg-yellow-500 text-black'
            case 'bronze':
                return 'bg-[#876634] text-white'
            case 'silver':
                return 'bg-gray-300 text-black'
            default:
                return 'bg-gray-200 text-black'
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-16">Loading...</div>
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                                alt="Spex Africa"
                                width={90}
                                height={90}
                                priority
                            />
                        </Link>
                        <nav className="hidden md:flex ml-6 space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center px-3 py-2 rounded-md hover:bg-accent"
                                >
                                    <item.icon className="h-4 w-4 mr-2" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <nav className="grid gap-6 text-lg font-medium">
                                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                                        <Package2 className="h-6 w-6" />
                                        <span>Spex Africa</span>
                                    </Link>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <item.icon className="h-5 w-5 mr-2" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 rounded-full hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                    <Avatar className="h-12 w-10">
                                        <AvatarImage src={imageUrl} alt={company ?? "User"} />
                                        <AvatarFallback>{company?.charAt(0) ?? "U"}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline-block font-medium truncate max-w-[100px]">{company ?? 'No company'}</span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    <span className="sr-only">Open user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2">
                                <DropdownMenuLabel className="font-normal p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{company ?? 'No company'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{code}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="p-2 focus:bg-accent rounded-md">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <span>{location ?? 'No location'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-2 focus:bg-accent rounded-md">
                                    <Badge className={`${getPlanBadgeVariant(subscription?.plan)} px-2 py-1`}>
                                        {subscription?.plan ?? 'No plan'}
                                    </Badge>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => router.push('/settings')} className="p-2 focus:bg-accent rounded-md">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => router.push('/password/request')} className="p-2 focus:bg-accent rounded-md">
                                    <KeySquareIcon className="mr-2 h-4 w-4" />
                                    <span>Password Reset</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => router.push('/support')} className="p-2 focus:bg-accent rounded-md">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Support</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={handleLogout} className="p-2 focus:bg-accent rounded-md text-red-600 hover:text-red-700">
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