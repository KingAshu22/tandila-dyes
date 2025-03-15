"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function FrontHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"}`}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold gradient-text">Goregaon Dyeing</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
                            Services
                        </Link>
                        <Link href="#about" className="text-foreground/80 hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="#gallery" className="text-foreground/80 hover:text-primary transition-colors">
                            Gallery
                        </Link>
                        <Link href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">
                            Testimonials
                        </Link>
                        <Link href="#contact">
                            <Button>Contact Us</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button>Login</Button>
                        </Link>
                    </nav>

                    <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        <Link
                            href="#features"
                            className="text-foreground/80 hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Services
                        </Link>
                        <Link
                            href="#about"
                            className="text-foreground/80 hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="#gallery"
                            className="text-foreground/80 hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Gallery
                        </Link>
                        <Link
                            href="#testimonials"
                            className="text-foreground/80 hover:text-primary transition-colors py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Testimonials
                        </Link>
                        <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full">Contact Us</Button>
                        </Link>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full">Login</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

