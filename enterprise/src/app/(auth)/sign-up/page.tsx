import Image from "next/image";
import SignUp from "@/components/auth/sign-up";

export default function Register() {
    return (
        <div className="w-full lg:grid  lg:grid-cols-3 ">

            {/* Sign-up form */}
            <div className=" w-full  lg:col-span-1 ">

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
