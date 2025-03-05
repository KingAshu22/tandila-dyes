import Image from "next/image"

export default function Gallery() {
    const galleryItems = [
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Vibrant dyed fabrics",
            title: "Vibrant Color Collection",
        },
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Denim dyeing process",
            title: "Denim Transformation",
        },
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Custom color matching",
            title: "Custom Color Matching",
        },
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Silk dyeing",
            title: "Luxury Fabric Dyeing",
        },
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Batch dyeing process",
            title: "Commercial Batch Processing",
        },
        {
            src: "/placeholder.svg?height=600&width=800",
            alt: "Color gradient samples",
            title: "Gradient Techniques",
        },
    ]

    return (
        <section id="gallery" className="section-padding bg-muted/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Work Gallery</h2>
                    <p className="text-muted-foreground text-lg">
                        Browse through our portfolio of dyeing projects showcasing our expertise and attention to detail.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-64 md:h-72">
                                <Image
                                    src={item.src || "/placeholder.svg"}
                                    alt={item.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

