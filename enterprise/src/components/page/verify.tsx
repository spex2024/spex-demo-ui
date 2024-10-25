"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Verify() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 25))
        }, 1500)

        return () => clearInterval(timer)
    }, [])

    const progressVariants = {
        initial: { width: 0 },
        animate: { width: `${progress}%` },
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen bg-[#71bc44] p-4"
        >
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl text-white font-bold mb-8"
            >
                Verifying Payment
            </motion.h1>
            <div className="w-full max-w-md h-4 bg-white/30 rounded-full overflow-hidden mb-4">
                <motion.div
                    className="h-full bg-white"
                    variants={progressVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-white/90 mb-2"
            >
                {progress}% Complete
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-white/80"
            >
                Please wait while we process your payment
            </motion.p>
        </motion.div>
    )
}