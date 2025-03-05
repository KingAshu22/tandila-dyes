import { Palette, Droplets, Shirt, Clock, Award, Recycle } from "lucide-react"

export default function Features() {
    const features = [
        {
            icon: <Palette className="h-10 w-10 text-primary" />,
            title: "Custom Color Matching",
            description: "We precisely match any color sample you provide, ensuring perfect results for your specific needs.",
        },
        {
            icon: <Droplets className="h-10 w-10 text-primary" />,
            title: "Eco-Friendly Dyes",
            description:
                "Our environmentally conscious dyes minimize ecological impact while delivering vibrant, long-lasting colors.",
        },
        {
            icon: <Shirt className="h-10 w-10 text-primary" />,
            title: "All Fabric Types",
            description: "From delicate silks to sturdy denims, we have specialized processes for every fabric type.",
        },
        {
            icon: <Clock className="h-10 w-10 text-primary" />,
            title: "Quick Turnaround",
            description: "Efficient processes and expert staff ensure your items are dyed and returned promptly.",
        },
        {
            icon: <Award className="h-10 w-10 text-primary" />,
            title: "Quality Guarantee",
            description: "We stand behind our work with a satisfaction guarantee on all dyeing services.",
        },
        {
            icon: <Recycle className="h-10 w-10 text-primary" />,
            title: "Revitalization Services",
            description: "Breathe new life into faded garments with our specialized color restoration techniques.",
        },
    ]

    return (
        <section id="features" className="section-padding bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Dyeing Services</h2>
                    <p className="text-muted-foreground text-lg">
                        Discover why leading brands and discerning customers choose Goregaon Dyeing for all their fabric coloring
                        needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-background rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

