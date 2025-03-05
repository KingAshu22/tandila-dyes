"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically send the form data to your backend
        console.log("Form submitted:", formData)
        alert("Thank you for your message! We will get back to you soon.")
        setFormData({ name: "", email: "", phone: "", message: "" })
    }

    return (
        <section id="contact" className="section-padding bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-muted-foreground text-lg">
                        Have questions about our dyeing services? Contact us today for a consultation or quote.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-background rounded-xl p-8 shadow-md">
                        <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block mb-2 font-medium">
                                    Your Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block mb-2 font-medium">
                                    Phone Number
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block mb-2 font-medium">
                                    Your Message
                                </label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your project or inquiry..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium mb-1">Our Location</h4>
                                        <p className="text-muted-foreground">
                                            123 Dyeing Street, Textile District
                                            <br />
                                            Fabricville, FC 12345
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium mb-1">Phone Number</h4>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium mb-1">Email Address</h4>
                                        <p className="text-muted-foreground">info@Tandiladyes.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-medium mb-1">Business Hours</h4>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 9:00 AM - 6:00 PM
                                            <br />
                                            Saturday: 10:00 AM - 4:00 PM
                                            <br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-primary/10 rounded-xl">
                            <h4 className="font-semibold text-lg mb-3">Ready to transform your fabrics?</h4>
                            <p className="mb-4">Get a free consultation and quote for your dyeing project.</p>
                            <Button variant="outline" className="w-full">
                                Request a Quote
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

