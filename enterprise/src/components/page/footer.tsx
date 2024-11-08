import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white text-gray-800 py-12 px-4">
            <div className="w-full mx-auto px-10">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 place-items-center ">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Spex Africa</h2>
                        <p className="text-xs mb-4">
                            SPEX is a meal marketplace that leverages a web platform/app to connect food vendors with enterprises and users seeking sustainable food packaging.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-[#71bc44]">
                                <Facebook size={20} />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-[#71bc44]">
                                <Twitter size={20} />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-gray-600 hover:text-[#71bc44]">
                                <Instagram size={20} />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-[#71bc44]">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <nav className=" text-xs grid grid-cols-2 gap-2">
                            <Link href="/user-interface" className="text-sxshover:text-[#71bc44] transition-colors">
                                User Interface
                            </Link>
                            <Link href="/vendor-interface" className="text-xs hover:text-[#71bc44] transition-colors">
                                Vendor Interface
                            </Link>
                            <Link href="/features" className="text-xs hover:text-[#71bc44] transition-colors">
                                Features
                            </Link>
                            <Link href="/pricing" className="text-xs hover:text-[#71bc44] transition-colors">
                                Pricing
                            </Link>
                            <Link href="/about" className="text-xs hover:text-[#71bc44] transition-colors">
                                About Us
                            </Link>
                            <Link href="/blog" className="text-xs hover:text-[#71bc44] transition-colors">
                                Blog
                            </Link>
                        </nav>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <address className="not-italic text-xs">
                            <p>Paterson Ave</p>
                            <p>Ritz, Adenta - Accra</p>
                            <p className="mt-2">Phone: +233 302 515 422</p>
                            <p>Email: hello@spexafrica.app</p>
                        </address>
                    </div>
                </div>
                <div className="h-px bg-[#71bc44] w-full mb-8" aria-hidden="true" />
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm mb-4 md:mb-0">
                        <p>&copy; {currentYear} Spex. All Rights Reserved.</p>
                        <p className="text-xs text-gray-600">Implemented by Dercolbags</p>
                    </div>
                    <nav className="flex space-x-6">
                        <Link href="/terms" className="text-sm hover:text-[#71bc44] transition-colors">
                            Terms
                        </Link>
                        <Link href="/policy" className="text-sm hover:text-[#71bc44] transition-colors">
                            Policy
                        </Link>
                        <Link href="/contact" className="text-sm hover:text-[#71bc44] transition-colors">
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}