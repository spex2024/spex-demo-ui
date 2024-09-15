import Image from "next/image"
import Request from "@/components/auth/request";
import React from "react";


export default function RequestPassword() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
            <div className="w-full flex flex-col items-center justify-center mx-auto">


                <Request/>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541343/prosp_rni5kb.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
