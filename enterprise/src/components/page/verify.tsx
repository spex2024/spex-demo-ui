'use client'

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"

export default function VerifyPayment() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-[#71bc44] p-4"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                    className="flex justify-center mb-6"
                >
                    <div className="bg-white/20 rounded-full p-4">
                        <CreditCard className="w-12 h-12 text-white" />
                    </div>
                </motion.div>
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl text-white font-bold mb-6 text-center"
                >
                    Verifying Payment
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-white/90 text-center mb-8"
                >
                    Please wait while we process your payment
                </motion.p>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="h-1 bg-white/30 rounded-full overflow-hidden"
                >
                    <motion.div
                        className="h-full bg-white"
                        animate={{
                            x: ["0%", "100%"],
                            scaleX: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}