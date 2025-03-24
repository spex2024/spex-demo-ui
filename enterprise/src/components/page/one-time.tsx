"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { useUserStore } from "@/store/profile"
import usePlans from "@/store/plans"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, CreditCard } from "lucide-react"
import { toast } from "react-hot-toast"

interface User {
    email?: string
}

interface Plan {
    _id: string
    plan: string
    pricePerHead: number
    staff: number
    features: string[]
}

interface UserStore {
    user?: User
    fetchUser: () => Promise<void>
}

export default function OneTime() {
    const { user, fetchUser } = useUserStore() as UserStore
    const { plans, fetchPlans } = usePlans()
    const [email, setEmail] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [staffCount, setStaffCount] = useState<number>(10)
    const [staffInputValue, setStaffInputValue] = useState<string>("10")
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0)

    useEffect(() => {
        fetchUser()
        fetchPlans()
    }, [fetchUser, fetchPlans])

    useEffect(() => {
        if (user && user.email) {
            setEmail(user.email)
        }
    }, [user])

    useEffect(() => {
        if (selectedPlan) {
            const payment = selectedPlan.pricePerHead * staffCount
            setMonthlyPayment(payment)
            setAmount(payment.toFixed(2))
        }
    }, [selectedPlan, staffCount])

    const baseurl =
        process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : typeof window !== "undefined" && window.location.hostname.endsWith(".site")
                ? "https://api.spexafrica.site"
                : "https://api.spexafrica.app"

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Ensure minimum staff count before submission
        if (staffCount < 10) {
            setStaffCount(10)
            setStaffInputValue("10")
            toast.error("Minimum staff count is 10")
            return
        }

        setLoading(true)

        const callbackUrl = new URL(`${window.location.origin}/payment/callback`)
        callbackUrl.searchParams.append("email", email)
        callbackUrl.searchParams.append("plan", selectedPlan?.plan || "")
        callbackUrl.searchParams.append("amount", amount)
        callbackUrl.searchParams.append("staff", staffCount.toString())

        try {
            const { data } = await axios.post(
                `${baseurl}/api/paystack/initialize-payment`,
                {
                    email,
                    amount: Number.parseFloat(amount),
                    callback_url: callbackUrl.toString(),
                    metadata: {
                        staff: staffCount,
                        plan: selectedPlan?.plan || "",
                        monthlyPayment,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                },
            )

            const paystackUrl = data.data.authorization_url
            window.location.href = paystackUrl
        } catch (error) {
            console.error("Payment initialization error:", error)
            toast.error(`${error}`)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (plan: Plan) => {
        setSelectedPlan(plan)
        const initialStaff = plan.staff || 10
        setStaffCount(initialStaff)
        setStaffInputValue(initialStaff.toString())
        const payment = plan.pricePerHead * initialStaff
        setMonthlyPayment(payment)
        setAmount(payment.toFixed(2))
    }

    const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setStaffInputValue(value)

        // Only update the actual staff count if the value is a valid number
        if (value !== "" && !isNaN(Number.parseInt(value))) {
            setStaffCount(Number.parseInt(value))
        }
    }

    const handleStaffInputBlur = () => {
        // Enforce minimum of 10 when field loses focus
        if (staffInputValue === "" || isNaN(Number.parseInt(staffInputValue)) || Number.parseInt(staffInputValue) < 10) {
            setStaffCount(10)
            setStaffInputValue("10")
        }
    }

    // Determine the popular plan index without modifying state
    const getPopularPlanIndex = () => {
        if (plans.length >= 3) {
            return 1 // Middle plan for 3 or more plans
        } else if (plans.length === 2) {
            return 0 // First plan for 2 plans
        }
        return -1 // No popular plan for 0 or 1 plan
    }

    return (
        <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-[#71bc44]/10">
            <h1 className="text-4xl font-bold text-center mb-12 text-[#71bc44]">Choose Your Subscription Plan</h1>
            {plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan: Plan, index: number) => {
                        const isPopular = index === getPopularPlanIndex()

                        return (
                            <motion.div
                                key={plan._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                            >
                                <Card
                                    className={`h-full flex flex-col transition-all duration-300 overflow-visible ${
                                        isPopular
                                            ? "border-[#71bc44] border-2 scale-105 z-10 shadow-xl hover:shadow-2xl relative before:absolute before:-inset-1.5 before:bg-[#71bc44]/10 before:rounded-xl before:blur-md before:-z-10"
                                            : "border-[#71bc44] border-t-4 shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    <CardHeader className="relative bg-gradient-to-r from-[#71bc44] to-[#71bc44]/80 text-white p-6 overflow-visible">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-3xl mb-2">{plan.plan}</CardTitle>
                                            <div className="flex flex-col gap-2">
                                                <Badge className="bg-white text-[#71bc44]">Monthly subscription</Badge>
                                            </div>
                                        </div>
                                        {isPopular && (
                                            <div className="absolute -top-4 -right-4 rotate-12 z-20">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-[#71bc44] rounded-full blur-sm opacity-50 scale-110"></div>
                                                    <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 transform -rotate-12">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                                                        </svg>
                                                        <span className="font-bold text-xs whitespace-nowrap">MOST POPULAR</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <CardDescription className="text-white/90">
                                            <div className="flex flex-col space-y-2 mt-2">
                                                <span className="text-2xl font-bold">GHS {plan.pricePerHead}</span>
                                                <span className="text-sm"> per staff member</span>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow p-6">
                                        <div className="space-y-6">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <CheckCircle className="h-5 w-5 text-[#71bc44] mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-6 bg-gray-50">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className={`w-full ${isPopular ? "bg-[#71bc44] hover:bg-[#71bc44]/90 text-white" : "bg-white border-2 border-[#71bc44] text-[#71bc44] hover:bg-[#71bc44]/10"}`}
                                                    size="lg"
                                                    onClick={() => openModal(plan)}
                                                >
                                                    {isPopular ? "Select Popular Plan" : "Select Plan"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] border-[#71bc44]">
                                                <DialogHeader className="border-b border-[#71bc44]/20 pb-4">
                                                    <DialogTitle className="text-[#71bc44] text-xl">Confirm Your Subscription</DialogTitle>
                                                    <DialogDescription>
                                                        You are about to subscribe to the {selectedPlan?.plan} plan.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handlePayment} className="space-y-6 pt-4">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email" className="text-[#71bc44]">
                                                                Email
                                                            </Label>
                                                            <Input
                                                                id="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                disabled={!!user?.email}
                                                                className="border-[#71bc44]/30 focus-visible:ring-[#71bc44]"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="staff" className="text-[#71bc44]">
                                                                Number of Staff (min. 10)
                                                            </Label>
                                                            <Input
                                                                id="staff"
                                                                type="number"
                                                                min={10}
                                                                value={staffInputValue}
                                                                onChange={handleStaffInputChange}
                                                                onBlur={handleStaffInputBlur}
                                                                className="border-[#71bc44]/30 focus-visible:ring-[#71bc44]"
                                                            />
                                                            {Number.parseInt(staffInputValue) < 10 && staffInputValue !== "" && (
                                                                <p className="text-xs text-red-500">Minimum staff count is 10</p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="monthlyPayment" className="text-[#71bc44]">
                                                                Monthly Payment
                                                            </Label>
                                                            <div className="p-3 bg-[#71bc44]/10 rounded-md text-[#71bc44] font-semibold">
                                                                GHS {monthlyPayment.toFixed(2)}
                                                            </div>
                                                            <p className="text-xs text-[#71bc44]/70">
                                                                {staffCount} staff × GHS {selectedPlan?.pricePerHead.toFixed(2) || "0.00"} per staff
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="w-full bg-[#71bc44] hover:bg-[#71bc44]/90"
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Processing
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    Confirm Subscription
                                                                </>
                                                            )}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-[#71bc44]" />
                </div>
            )}
        </div>
    )
}

