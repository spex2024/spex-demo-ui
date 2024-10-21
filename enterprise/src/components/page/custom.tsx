"use client"

import { useState } from "react"
import { CheckCircle, Users, MessageSquare, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function CustomPlan() {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <Card className="w-full max-w-5xl mx-auto mt-10 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-[#71bc44] border-t-4">
            <CardHeader className="relative bg-gradient-to-r from-[#71bc44] to-[#71bc44] text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-bold">Custom Plan</CardTitle>
                        <CardDescription className="text-white/90 mt-2">Tailored for large enterprises</CardDescription>
                    </div>
                    <Badge className="bg-white text-[#71bc44] text-sm font-medium hover:bg-[#71bc44] hover:text-white transition-colors duration-200">
                        Contact us
                    </Badge>
                </div>
                <div className="mt-4 space-y-2">
                    <span className="text-2xl font-bold">Starts from 100 staff</span>
                    <p className="text-white/90">Flexible pricing based on your needs</p>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <ul className="grid gap-4 sm:grid-cols-2 gap-6">
                    {[
                        "Customized pack quantities",
                        "Flexible payment plan",
                        "Full access to SPEX platform",
                        "Advanced pack customization",
                        "Choose up to 2 vendors",
                        "Email or phone support",
                        "Bring your own vendor or choose from our platform",
                    ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-base">
                            <CheckCircle className="h-5 w-5 text-[#71bc44] mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="p-6 bg-[#71bc44]/5">
                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-[#71bc44]" />
                            <span className="text-sm">100+ staff members</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-[#71bc44]" />
                            <span className="text-sm">Dedicated account manager</span>
                        </div>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-[#71bc44] hover:bg-[#71bc44]/90 text-white" size="lg">
                                Contact Sales for Custom Quote
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md border-[#71bc44]">
                            <DialogHeader>
                                <DialogTitle>Contact Information</DialogTitle>
                                <DialogDescription>
                                    Get in touch with our sales team for a custom quote.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex items-center gap-4">
                                    <Phone className="h-5 w-5 text-[#71bc44]" />
                                    <p className="text-sm font-medium">Phone: (233) 30 252 5384</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="h-5 w-5 text-[#71bc44]" />
                                    <p className="text-sm font-medium">Email: hello@spexafrica.app</p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => setDialogOpen(false)} className="bg-[#71bc44] hover:bg-[#71bc44]/90 text-white">Close</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardFooter>
        </Card>
    )
}