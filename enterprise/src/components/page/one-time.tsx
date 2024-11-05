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
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
import {Loader2, CheckCircle, Users, CreditCard} from "lucide-react"
import {toast} from "react-hot-toast";

interface User {
    email?: string
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

    const baseurl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : (typeof window !== 'undefined' && window.location.hostname.endsWith('.site'))
            ? 'https://api.spexafrica.site'
            : 'https://api.spexafrica.app';


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
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                })

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
        const discountedPrice = plan.paymentType === 'one-time' ? plan.price * 0.9 : plan.price
        setAmount(discountedPrice.toFixed(2))
    }

    const calculatePricePerUser = (plan: Plan, discounted: boolean = false) => {
        const price = discounted && plan.paymentType === 'one-time' ? plan.price * 0.9 : plan.price
        return (price / plan.staff).toFixed(2)
    }

    const oneTimePlans = plans.filter((plan: { paymentType: string }) => plan.paymentType === 'one-time');

    const sortedPlans = [...oneTimePlans].sort((a, b) => {
        if (a.paymentType === 'one-time' && b.paymentType !== 'one-time') return -1
        if (a.paymentType !== 'one-time' && b.paymentType === 'one-time') return 1
        return 0
    })

    return (
        <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-[#71bc44]/10">
            <h1 className="text-4xl font-bold text-center mb-12 text-[#71bc44]">Choose Your One-Time Plan</h1>
            {oneTimePlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sortedPlans.map((plan, index) => (
                        <motion.div
                            key={plan._id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5, delay: index * 0.1 + 0.3}}
                        >
                            <Card
                                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-[#71bc44] border-t-4">
                                <CardHeader
                                    className="relative bg-gradient-to-r from-[#71bc44] to-[#71bc44]/80 text-white p-6">
                                    <Badge className="absolute top-4 right-4 bg-white text-[#71bc44]">
                                        {plan.paymentType} payment
                                    </Badge>
                                    <CardTitle className="text-3xl mb-2">
                                        {plan.plan}
                                    </CardTitle>
                                    <CardDescription className="text-white/90">
                                        <div className="flex flex-col space-y-2 mt-2">
                      <span className={`text-2xl font-bold ${plan.paymentType === "one-time" ? "line-through" : ""}`}>
                        GHS {plan.price.toFixed(2)}
                      </span>
                                            {plan.paymentType === "one-time" && (
                                                <span className="text-2xl font-bold">
                          GHS {(plan.price * 0.9).toFixed(2)} <span className="text-sm font-normal">(10% off)</span>
                        </span>
                                            )}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow p-6">
                                    <div className="space-y-6">
                                        <div
                                            className="flex items-center justify-between p-3 bg-[#71bc44]/10 rounded-lg">
                                            <span className="text-sm font-medium">Price per user:</span>
                                            <span className="text-sm font-semibold text-[#71bc44]">
                        {plan.paymentType === "one-time" ? (
                            <>
                            <span className="line-through text-muted-foreground mr-2">
                              GHS {calculatePricePerUser(plan)}
                            </span>
                                GHS {calculatePricePerUser(plan, true)}
                            </>
                        ) : (
                            <>GHS {calculatePricePerUser(plan)}</>
                        )}
                      </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Users className="h-5 w-5 text-[#71bc44]"/>
                                            <span>{plan.staff} staff members</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                                                <li key={index} className="flex items-start">
                                                    <CheckCircle className="h-5 w-5 text-[#71bc44] mr-2 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="w-full bg-[#71bc44] hover:bg-[#71bc44]/90" size="lg" onClick={() => openModal(plan)}>
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
                                            <form onSubmit={handlePayment} className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            disabled={!!user?.email}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">Amount</Label>
                                                        <Input
                                                            id="amount"
                                                            value={amount}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" disabled={loading} className="w-full bg-[#71bc44] hover:bg-[#71bc44]/90">
                                                        {loading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Processing
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CreditCard className="mr-2 h-4 w-4" />
                                                                Confirm Payment
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
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-[#71bc44]" />
                </div>
            )}
        </div>
    )
}