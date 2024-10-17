'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {Menu, MapPin, Package2, UsersIcon, CreditCard, HelpCircle, LogOut, Settings, KeySquareIcon} from 'lucide-react'
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
    { href: '/', label: 'Dashboard' },
    { href: '/employees', label: 'Employees' },
    { href: '/vendors', label: 'Vendors' },
    { href: '/orders', label: 'Orders' },
    { href: '/subscribe', label: 'Subscription' },
    { href: '/settings', label: 'Settings' },
]

const Header: React.FC = () => {
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
            case 'Gold':
                return 'bg-yellow-500 text-black'  // Custom Gold color (yellow)
            case 'Bronze':
                return 'bg-[#876634] text-white'   // Custom Bronze color (brown)
            case 'Silver':
                return 'bg-gray-300 text-black'    // Custom Silver color (gray)
            default:
                return 'bg-gray-200 text-black'    // Default plan (secondary)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-16">Loading...</div>
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container max-w-7xl flex h-16 items-center">
                <nav className="hidden md:flex md:flex-1">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Image
                            src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1722177650/spex_logo-03_png_dui5ur.png"
                            alt="Spex Africa"
                            width={90}
                            height={90}
                            priority
                        />
                    </Link>
                    <ul className="flex items-center space-x-6">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
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
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full border-2 border-[]">
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
                                <span className="sr-only">Open user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{company ?? 'No company'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{code}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>{location ?? 'No location'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>

                                    <Badge className={getPlanBadgeVariant(subscription?.plan)}>
                                        {subscription?.plan ?? 'No plan'}
                                    </Badge>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => router.push('/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push('/password/request')}>
                                <KeySquareIcon className="mr-2 h-4 w-4" />
                                <span>Password Reset</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => router.push('/support')}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Support</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header