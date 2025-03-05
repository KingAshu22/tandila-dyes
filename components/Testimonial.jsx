import Image from "next/image"
import { Star } from "lucide-react"

export default function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Fashion Designer",
            image: "/placeholder.svg?height=200&width=200",
            content:
                "Goregaon Dyeing has been my go-to for all fabric dyeing needs. Their attention to detail and ability to match colors perfectly has been invaluable for my design work.",
            stars: 5,
        },
        {
            name: "Michael Chen",
            role: "Production Manager, TextilePro",
            image: "/placeholder.svg?height=200&width=200",
            content:
                "We've partnered with Goregaon Dyeing for our commercial dyeing requirements for over 5 years. Their consistency, quality, and turnaround time are unmatched in the industry.",
            stars: 5,
        },
        {
            name: "Emma Rodriguez",
            role: "Costume Department Head",
            image: "/placeholder.svg?height=200&width=200",
            content:
                "When we need specialized dyeing for our production costumes, Goregaon Dyeing always delivers exceptional results, even with our tight deadlines and unique requirements.",
            stars: 5,
        },
    ]

    return (
        <section id="testimonials" className="section-padding">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
                    <p className="text-muted-foreground text-lg">
                        Don't just take our word for it. Here's what our satisfied customers have to say about our dyeing services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative h-14 w-14 rounded-full overflow-hidden">
                                    <Image
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{testimonial.name}</h3>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                                ))}
                            </div>

                            <p className="text-muted-foreground">"{testimonial.content}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

