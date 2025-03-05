import Hero from "@/components/Hero"
import Features from "@/components/Features"
import About from "@/components/About"
import Gallery from "@/components/Gallery"
import Testimonials from "@/components/Testimonial"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import FrontHeader from "@/components/FrontHeader"

export default function Home() {
  return (
    <main className="min-h-screen">
      <FrontHeader />
      <Hero />
      <Features />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}

