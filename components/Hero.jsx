import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 -z-10" />

            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            Transform Your <span className="gradient-text">Fabrics</span> With Expert Dyeing
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Goregaon Dyeing brings colors to life with premium quality dyeing services for all types of fabrics and
                            clothing. Revitalize your wardrobe with our expert solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button size="lg" className="text-lg">
                                Our Services
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg">
                                Get a Quote
                            </Button>
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src="/placeholder.svg?height=1000&width=800"
                            alt="Colorful dyed fabrics"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

