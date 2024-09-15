import Image from "next/image"
import SignIn from "@/components/auth/sign-in";


export default function Login() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-3 xl:min-h-[800px] ">
            <div className="flex items-center justify-center py-12 lg:col-span-1">

                    <SignIn/>
            </div>
            <div className="hidden bg-muted lg:block lg:col-span-2">
                <Image
                    src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541196/spex_jrkich.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
