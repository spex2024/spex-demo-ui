import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CustomPlan() {
    return (
        <Card className="w-full max-w-3xl mx-auto mt-10">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Custom Plan</CardTitle>
                        <CardDescription className={`text-xs`}>Tailored to your specific needs</CardDescription>
                    </div>
                    <Badge
                        style={{ backgroundColor: '#22c55e', color: 'white' }}
                        className="text-sm font-medium"
                    >
                        Contact us
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="grid gap-4 sm:grid-cols-2">
                    {[
                        "Customized pack quantities",
                        "Flexible payment plan",
                        "Access to SPEX platform",
                        "Pack customization",
                        "Choose up to 2 vendors",
                        "Email and phone support",
                        "Bring your own vendor or choose from our platform"
                    ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle style={{ color: '#22c55e' }} className="h-5 w-5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}