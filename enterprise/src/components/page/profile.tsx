'use client'

import React, { useEffect } from 'react'
import {
    LogOut,
    Trash2,
    MapPin,
    Mail,
    Phone,
    Building,
    Edit,
    Camera,
    SubscriptIcon,
    BadgeCheck,
    IdCard
} from 'lucide-react'
import UpdateEntForm from '@/components/page/profile-update'
import { useUserStore } from '@/store/profile'
import useAuth from "@/hook/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface Enterprise {
    _id: string
    company: string
    branch: string
    code: string
    location: string
    email: string
    phone: string
    imageUrl: string
    subscription:{
        plan:string
    }
}

export default function ProfileTab() {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
            <EnterpriseCard />
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <Button
                        variant="ghost"
                        className="w-full py-6 px-4 justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                    <hr className="border-gray-200" />
                    <Button
                        variant="ghost"
                        className="w-full py-6 px-4 justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none"
                    >
                        <Trash2 className="mr-2 h-5 w-5" />
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

function EnterpriseCard() {
    const { user, fetchUser, loading } = useUserStore() as { user: Enterprise | null; fetchUser: () => void; loading: boolean }

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    if (loading) {
        return <EnterpriseCardSkeleton />
    }

    if (!user) {
        return (
            <Card className="w-full">
                <CardContent className="p-6 text-center text-gray-500">
                    No user data available
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full overflow-hidden bg-white shadow-lg">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent" />
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 rounded-full"
                >
                    <Camera className="h-4 w-4" />
                </Button>
            </div>
            <CardContent className="p-6 pt-0 relative">
                <div className="flex justify-between items-end mb-4">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl -mt-16">
                        <AvatarImage src={user?.imageUrl} alt={user?.company} />
                        <AvatarFallback>{user?.company.charAt(0)}</AvatarFallback>
                    </Avatar>

                   <UpdateEntForm agency={user}/>


                </div>
                <div className="w-full space-y-1 mb-4">
                    <h2 className="text-2xl font-bold">{user?.company}</h2>
                    <p className="text-sm text-gray-500 flex items-center justify-items-center gap-5"> <IdCard size={20}/> Account ID: {user?.code}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-items-center gap-5"><BadgeCheck size={20}/> Plan: {user?.subscription.plan}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={MapPin} text={user?.location} />
                    <InfoItem icon={Mail} text={user?.email} />
                    <InfoItem icon={Phone} text={user?.phone} />
                    <InfoItem icon={Building} text={user?.branch} />
                </div>
            </CardContent>
        </Card>
    )
}

function InfoItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-md p-3">
            <Icon className="mr-3 h-5 w-5 text-gray-400" />
            <span className="font-medium">{text}</span>
        </div>
    )
}

function EnterpriseCardSkeleton() {
    return (
        <Card className="w-full overflow-hidden bg-white shadow-lg">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <CardContent className="p-6 pt-0 relative">
                <div className="flex justify-between items-end mb-4">
                    <Skeleton className="h-32 w-32 rounded-full -mt-16" />
                    <Skeleton className="h-9 w-28" />
                </div>
                <div className="space-y-2 mb-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}