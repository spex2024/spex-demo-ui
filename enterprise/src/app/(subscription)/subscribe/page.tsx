"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from "lucide-react"
import OneTime from "@/components/page/one-time"
import useAuth from "@/hook/auth"
import { toast } from "react-hot-toast"

export default function Plans() {
    const { logout, success, error } = useAuth()

    useEffect(() => {
        if (success) {
            toast.success(success)
        } else if (error) {
            toast.error(error)
        }
    }, [success, error])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="w-full mx-auto min-h-screen px-4 py-8 bg-gradient-to-b from-background to-[#71bc44]/10 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <Button asChild variant="ghost" className="w-full sm:w-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 w-full sm:w-auto">
                    <LogOut size={16} />
                    Logout
                </Button>
            </div>
            <div className="w-full max-w-7xl mx-auto">
                <OneTime />
            </div>
        </div>
    )
}

