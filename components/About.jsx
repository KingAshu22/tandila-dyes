import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function About() {
    const highlights = [
        "Over 15 years of industry experience",
        "State-of-the-art dyeing facilities",
        "Certified color specialists",
        "Sustainable and eco-friendly processes",
        "Trusted by leading fashion brands",
    ]

    return (
        <section id="about" className="section-padding">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
                        <Image
                            src="/placeholder.svg?height=1000&width=800"
                            alt="Goregaon Dyeing workshop"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="order-1 lg:order-2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">About Goregaon Dyeing</h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Founded with a passion for color and quality, Goregaon Dyeing has grown to become a leading provider of
                            professional dyeing services. Our journey began with a simple mission: to deliver exceptional color
                            transformations for all types of fabrics.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8">
                            Today, we combine traditional dyeing expertise with modern technology to offer services that meet the
                            highest standards of quality, consistency, and environmental responsibility.
                        </p>

                        <div className="space-y-3 mb-8">
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button size="lg">Learn More About Us</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

