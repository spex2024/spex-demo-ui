'use client'

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal,
    useEffect,
    useState
} from 'react'
import axios from 'axios'
import {useUserStore} from "@/store/profile"
import usePlans from "@/store/plans"
import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
import {Loader2, CheckCircle, Users} from "lucide-react"
interface User{
    email?:string
}
interface Plan {
    _id: string
    plan: string
    price: number
    paymentType: 'one-time' | 'monthly'
    staff: number
    features: string[]
}
interface UserStore {
    user?: User
    fetchUser: () => Promise<void>
}

export default function OneTime() {
    const {user, fetchUser} = useUserStore() as UserStore
    const {plans, fetchPlans} = usePlans()
    const [email, setEmail] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

    useEffect(() => {
        fetchUser()
        fetchPlans()
    }, [fetchUser, fetchPlans])

    useEffect(() => {
        if (user && user.email) {
            setEmail(user.email)
        }
    }, [user])
    const baseurl = 'https://api.spexafrica.site';
    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const callbackUrl = new URL(`${window.location.origin}/payment/callback`)
        callbackUrl.searchParams.append('email', email)
        callbackUrl.searchParams.append('plan', selectedPlan?.plan || '')
        callbackUrl.searchParams.append('amount', amount)

        try {
            const {data} = await axios.post(`${baseurl}/api/paystack/initialize-payment`, {
                email,
                amount: parseFloat(amount),
                callback_url: callbackUrl.toString(),
            },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`, // Use an environment variable for your secret key
                        'Content-Type': 'application/json',
                    },
                }
            )

            const paystackUrl = data.data.authorization_url
            window.location.href = paystackUrl
        } catch (error) {
            console.error("Payment initialization error:", error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (plan: Plan) => {
        setSelectedPlan(plan)
        const discountedPrice = plan.paymentType === 'one-time' ? plan.price * 0.9 : plan.price
        setAmount(discountedPrice.toFixed(2))
    }

    const calculatePricePerUser = (plan: Plan, discounted: boolean = false) => {
        const price = discounted && plan.paymentType === 'one-time' ? plan.price * 0.9 : plan.price
        return (price / plan.staff).toFixed(2)
    }

    const sortedPlans = [...plans].sort((a, b) => {
        if (a.paymentType === 'one-time' && b.paymentType !== 'one-time') return -1
        if (a.paymentType !== 'one-time' && b.paymentType === 'one-time') return 1
        return 0
    })

    return (
        <div className="container mx-auto px-4 py-10 bg-gradient-to-b from-background to-secondary/10">


            {plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sortedPlans.map((plan, index) => (
                        <motion.div
                            key={plan._id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.1 + 0.3}}
                        >
                            <Card
                                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader className="relative">

                                    <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                                        {plan.paymentType} payment
                                    </Badge>

                                    <CardTitle className="text-2xl">
                                        {plan.plan}
                                    </CardTitle>
                                    <CardDescription>
                                        <div className="flex flex-col space-y-2 mt-2">
                                            <span
                                                className={`text-xl font-bold ${plan.paymentType === "one-time" ? "line-through text-muted-foreground" : "text-primary"}`}>
                                                GHS {plan.price.toFixed(2)}
                                            </span>
                                            {plan.paymentType === "one-time" && (
                                                <span className="text-xl font-bold text-green-600">
                                                    GHS {(plan.price * 0.9).toFixed(2)} <span
                                                    className="text-sm font-normal">(10% off)</span>
                                                </span>
                                            )}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="space-y-4">
                                        <div className="flex flex-col space-y-2 p-3 bg-secondary rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm`}>Price per user:</span>
                                                <span className="text-xs font-semibold">
                                                    {plan.paymentType === "one-time" ? (
                                                        <>
                                                            <span className="line-through text-muted-foreground">
                                                                GHS {calculatePricePerUser(plan)}
                                                            </span>
                                                            <span className="ml-2 text-green-600">
                                                                GHS {calculatePricePerUser(plan, true)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>GHS {calculatePricePerUser(plan)}</span>
                                                    )}
                                                </span>
                                            </div>
                                            {plan.paymentType === "one-time" && (
                                                <div className="text-xs text-green-600 text-right">
                                                    (10% off with one-time payment)
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs">
                                            <Users className="h-5 w-5 text-primary"/>
                                            <span>{plan.staff} staff members</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                                                <li key={index} className="text-xs flex items-center">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full" size="lg" onClick={() => openModal(plan)}>
                                                Select Plan
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Confirm Your Payment</DialogTitle>
                                                <DialogDescription>
                                                    You are about to subscribe to the {selectedPlan?.plan} plan.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handlePayment}>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="email" className="text-right">
                                                            Email
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="col-span-3"
                                                            disabled={!!user?.email}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="amount" className="text-right">
                                                            Amount
                                                        </Label>
                                                        <Input
                                                            id="amount"
                                                            value={amount}
                                                            className="col-span-3"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={loading}>
                                                        {loading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Processing
                                                            </>
                                                        ) : (
                                                            'Confirm Payment'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </div>
    )
}