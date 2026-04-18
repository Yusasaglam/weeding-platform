import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import DemoGallery from '@/components/landing/DemoGallery'
import PricingPreview from '@/components/landing/PricingPreview'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <DemoGallery />
      <PricingPreview />
      <CTASection />
      <Footer />
    </main>
  )
}
