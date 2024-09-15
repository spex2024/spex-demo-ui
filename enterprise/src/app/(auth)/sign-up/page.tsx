import Image from "next/image";
import SignUp from "@/components/auth/sign-up";

export default function Register() {
    return (
        <div className="relative w-full lg:grid lg:max-h-screen lg:grid-cols-3 ">

            {/* Sign-up form */}
            <div className=" w-full flex flex-col items-center justify-center  lg:col-span-1 lg:mt-7 lg:px-20">
                <h1 className="text-2xl font-bold">Welcome to Our Platform</h1>
                <p className="text-lg text-gray-600">Create your account to get started.</p>
                <SignUp/>
            </div>

            {/* Image with text overlay */}
            <div className="relative lg:flex hidden bg-muted  lg:col-span-2">
                <Image
                    src="https://res.cloudinary.com/ddwet1dzj/image/upload/v1720541343/hero-1_raxkds.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover object-center brightness-[0.5] grayscale"
                />
            </div>
        </div>
    );
}
