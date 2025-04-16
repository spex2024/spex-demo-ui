"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { useUserStore } from "@/store/profile"
import usePlans from "@/store/plans"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Users, Check, Sparkles, ArrowRight, Globe } from "lucide-react"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

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

// Currency conversion rate (approximate)
const USD_TO_GHC_RATE = 14

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
    const [currency, setCurrency] = useState<"ghc" | "usd">("ghc")

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

    // Convert price based on selected currency
    const getPrice = (priceInGHC: number) => {
        if (currency === "ghc") return priceInGHC
        return Number.parseFloat((priceInGHC / USD_TO_GHC_RATE).toFixed(2))
    }

    // Get currency symbol
    const getCurrencySymbol = () => (currency === "ghc" ? "₵" : "$")

    // Toggle currency
    const toggleCurrency = () => {
        setCurrency(currency === "ghc" ? "usd" : "ghc")
    }

    return (
        <div className="relative overflow-hidden min-h-screen">


            <div className="container mx-auto px-4 py-16 relative z-10">


                {/* Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#71bc44] to-[#4a9c1d] bg-clip-text text-transparent">
                            Choose Your Perfect Plan
                        </h1>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                                Select the subscription that best fits your business needs and start managing your team efficiently.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Currency Toggle */}
                <div className="flex justify-center mb-16">
                    <motion.div
                        className="bg-white/80 p-2  flex items-center gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
            <span className={`text-base font-medium ${currency === "ghc" ? "text-[#71bc44]" : "text-gray-500"}`}>
              GHC
            </span>
                        <Switch
                            checked={currency === "usd"}
                            onCheckedChange={toggleCurrency}
                            className="data-[state=checked]:bg-[#71bc44]"
                        />
                        <span className={`text-base font-medium ${currency === "usd" ? "text-[#71bc44]" : "text-gray-500"}`}>
              USD
            </span>
                        <Globe className="h-4 w-4 text-gray-400 ml-1" />
                    </motion.div>
                </div>

                {plans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {plans.map((plan: Plan, index: number) => {
                            const isPopular = index === getPopularPlanIndex()
                            const delay = index * 0.15
                            const priceInCurrentCurrency = getPrice(plan.pricePerHead)

                            return (
                                <motion.div
                                    key={plan._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay }}
                                    whileHover={{
                                        y: -12,
                                        transition: { duration: 0.2 },
                                    }}
                                    className="h-full"
                                >
                                    <Card
                                        className={cn(
                                            "h-full rounded-2xl overflow-hidden border-0",
                                            isPopular
                                                ? "shadow-[0_20px_50px_-15px_rgba(113,188,68,0.5)]"
                                                : "shadow-xl hover:shadow-2xl bg-white",
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "p-8 relative",
                                                isPopular
                                                    ? "bg-gradient-to-br from-[#71bc44] to-[#4a9c1d]"
                                                    : "bg-white border-b border-gray-100",
                                            )}
                                        >
                                            {isPopular && (
                                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                                    <div className="bg-white text-[#71bc44] px-4 py-3 rounded-b-3xl shadow-lg flex items-center gap-1.5 font-medium text-sm">
                                                        <Sparkles className="h-4 w-4" />
                                                        MOST POPULAR
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <h2 className={cn("text-3xl font-bold mb-2", isPopular ? "text-white" : "text-gray-800")}>
                                                    {plan.plan}
                                                </h2>
                                                <p className={cn("mb-6 text-lg", isPopular ? "text-white/90" : "text-gray-600")}>
                                                    For scaling businesses
                                                </p>

                                                <div className="mb-2 flex items-baseline">
                          <span className={cn("text-5xl font-bold", isPopular ? "text-white" : "text-gray-800")}>
                            {getCurrencySymbol()}
                              {priceInCurrentCurrency}
                          </span>
                                                    <span className={cn("ml-2 text-lg", isPopular ? "text-white/80" : "text-gray-500")}>
                            / staff
                          </span>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "uppercase text-sm tracking-wider mb-6",
                                                        isPopular ? "text-white/80" : "text-gray-500",
                                                    )}
                                                >
                                                    DAILY
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-white">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        className={cn(
                                                            "w-full py-6 px-4 rounded-xl font-medium text-base transition-all duration-300 mb-8 flex items-center justify-center gap-2 text-base",
                                                            isPopular
                                                                ? "bg-gradient-to-r from-[#71bc44] to-[#4a9c1d] text-white shadow-lg shadow-[#71bc44]/30 hover:shadow-xl hover:shadow-[#71bc44]/40 hover:scale-105"
                                                                : "bg-white border-2 border-[#71bc44] text-[#71bc44] hover:bg-[#71bc44]/5 hover:scale-105",
                                                        )}
                                                        onClick={() => openModal(plan)}
                                                    >
                                                        {isPopular ? "Get Started Now" : "Select Plan"}
                                                        <ArrowRight className="h-4 w-4 ml-1" />
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent className="sm:max-w-[450px] rounded-2xl border-0 shadow-2xl p-0 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-[#71bc44] to-[#4a9c1d] p-6 text-white">
                                                        <DialogHeader className="pb-4">
                                                            <DialogTitle className="text-2xl font-bold">{selectedPlan?.plan} Plan</DialogTitle>
                                                            <DialogDescription className="text-white/90 text-base">
                                                                Complete your subscription details
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </div>

                                                    <form onSubmit={handlePayment} className="p-6">
                                                        <div className="space-y-5">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                                                    Email Address
                                                                </Label>
                                                                <Input
                                                                    id="email"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    disabled={!!user?.email}
                                                                    className="rounded-lg h-11 border-gray-300 focus-visible:ring-[#71bc44] focus-visible:border-[#71bc44]"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label htmlFor="staff" className="text-gray-700 font-medium">
                                                                        Number of Staff
                                                                    </Label>
                                                                    <span className="text-xs text-gray-500">Minimum: 10</span>
                                                                </div>
                                                                <div className="relative">
                                                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                                                    <Input
                                                                        id="staff"
                                                                        type="number"
                                                                        min={10}
                                                                        value={staffInputValue}
                                                                        onChange={handleStaffInputChange}
                                                                        onBlur={handleStaffInputBlur}
                                                                        className="rounded-lg h-11 pl-10 border-gray-300 focus-visible:ring-[#71bc44] focus-visible:border-[#71bc44]"
                                                                    />
                                                                </div>
                                                                {Number.parseInt(staffInputValue) < 10 && staffInputValue !== "" && (
                                                                    <p className="text-xs text-red-500">Minimum staff count is 10</p>
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="monthlyPayment" className="text-gray-700 font-medium">
                                                                    Monthly Payment
                                                                </Label>
                                                                <div className="p-4 bg-[#f8fcf5] rounded-lg border border-[#71bc44]/20">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600">Total</span>
                                                                        <span className="text-2xl font-bold text-[#71bc44]">
                                      {getCurrencySymbol()}{" "}
                                                                            {currency === "ghc"
                                                                                ? monthlyPayment.toFixed(2)
                                                                                : (monthlyPayment / USD_TO_GHC_RATE).toFixed(2)}
                                    </span>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 mt-2">
                                                                        {staffCount} staff × {getCurrencySymbol()}{" "}
                                                                        {currency === "ghc"
                                                                            ? (selectedPlan?.pricePerHead || 0).toFixed(2)
                                                                            : ((selectedPlan?.pricePerHead || 0) / USD_TO_GHC_RATE).toFixed(2)}{" "}
                                                                        per staff
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-8">
                                                            <Button
                                                                type="submit"
                                                                disabled={loading}
                                                                className="w-full h-12 rounded-xl font-medium text-base bg-gradient-to-r from-[#71bc44] to-[#4a9c1d] text-white shadow-lg shadow-[#71bc44]/30 hover:shadow-xl hover:shadow-[#71bc44]/40 border-0 transition-all duration-300"
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CreditCard className="mr-2 h-5 w-5" />
                                                                        Complete Subscription
                                                                    </>
                                                                )}
                                                            </Button>

                                                            <p className="text-xs text-center text-gray-500 mt-4">
                                                                By subscribing, you agree to our Terms of Service and Privacy Policy
                                                            </p>
                                                        </div>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>

                                            <ul className="space-y-4">
                                                {plan.features.map((feature, idx) => (
                                                    <motion.li
                                                        key={idx}
                                                        className="flex items-start gap-3"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.3, delay: delay + 0.1 + idx * 0.1 }}
                                                    >
                                                        <div
                                                            className={`rounded-full p-1 flex-shrink-0 ${isPopular ? "bg-[#71bc44]/10 text-[#71bc44]" : "bg-[#71bc44]/10 text-[#71bc44]"}`}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-gray-700">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#71bc44]" />
                            <p className="mt-4 text-gray-500">Loading subscription plans...</p>
                        </div>
                    </div>
                )}

                {/*<motion.div*/}
                {/*    className="mt-20 text-center"*/}
                {/*    initial={{ opacity: 0, y: 20 }}*/}
                {/*    animate={{ opacity: 1, y: 0 }}*/}
                {/*    transition={{ duration: 0.6, delay: 0.8 }}*/}
                {/*>*/}
                {/*    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#71bc44]/10 max-w-2xl mx-auto">*/}
                {/*        <h3 className="text-xl font-semibold text-gray-800 mb-3">Need a custom plan for your enterprise?</h3>*/}
                {/*        <p className="text-gray-600 mb-4">*/}
                {/*            /!* eslint-disable-next-line react/no-unescaped-entities *!/*/}
                {/*            Our team can create a tailored solution that perfectly fits your organization's unique requirements.*/}
                {/*        </p>*/}
                {/*        <Button className="bg-gradient-to-r from-[#71bc44] to-[#4a9c1d] text-white border-0 hover:shadow-lg transition-all duration-300">*/}
                {/*            Contact our sales team*/}
                {/*        </Button>*/}
                {/*    </div>*/}
                {/*</motion.div>*/}
            </div>
        </div>
    )
}
