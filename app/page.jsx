'use client'
import Hero from '../components/Hero'
import ServiceCard from '../components/ServiceCard'
import ProjectGrid from '../components/ProjectGrid'
import TestimonialCarousel from '../components/TestimonialCarousel'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle2, ChevronRight, Shield } from 'lucide-react'

export default function Home() {
  const processSteps = [
    {
      step: '01',
      title: 'Consultation & Site Analysis',
      desc: 'We visit your space, understand your style preference, and discuss space layout potential, budget alignments, and timelines.'
    },
    {
      step: '02',
      title: 'Concept & 3D Visualization',
      desc: 'Our design studio engineers high-definition 3D models, moodboards, and material selections, allowing you to walk through your future space.'
    },
    {
      step: '03',
      title: 'Execution & Quality Check',
      desc: 'Our craftsmen and modular engineering units construct your custom carpentry and styling details under rigid site supervision.'
    }
  ]

  const stats = [
    { value: '100%', label: 'Bespoke Customization', icon: CheckCircle2 },
    { value: '5-Year', label: 'Structural Warranty', icon: Shield }
  ]

  return (
    <div className="bg-warmcream">
      {/* Hero section */}
      <Hero />

      {/* Services Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase block mb-2">Our Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold">Services We Specialize In</h2>
          </div>
          <Link href="/services" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-charcoal transition-colors flex items-center gap-1.5 shrink-0">
            <span>View All Services</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard title="Residential Interiors" desc="Sophisticated villa and penthouse designs tailored completely to your lifestyle." />
          <ServiceCard title="Commercial Interiors" desc="Functional, beautiful corporate workspace concepts and retail boutique styling." />
          <ServiceCard title="Modular Kitchens" desc="Efficient, elegant culinary hubs with custom marble surfaces and soft-close storage." />
        </div>
      </section>

      {/* High-End Process Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">How We Work</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mt-2 mb-4 font-bold">Our Seamless Design Process</h2>
            <p className="text-muted text-sm">
              We guide you step-by-step from raw site blueprint measurements to full-scale turnkey design delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line for process dots */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1.5px] bg-gold/15 z-0" />
            
            {processSteps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative z-10 text-center flex flex-col items-center px-4"
              >
                <div className="w-16 h-16 rounded-full bg-warmcream text-gold border border-gold/25 font-bold text-lg flex items-center justify-center mb-6 shadow-sm hover:bg-gold hover:text-white transition-all duration-500">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-charcoal font-serif mb-3">{item.title}</h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 px-6 bg-beige">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-semibold tracking-widest text-gold uppercase block mb-2">Our Work</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold">Highlighted Creations</h2>
            </div>
            <Link href="/portfolio" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-charcoal transition-colors flex items-center gap-1.5 shrink-0">
              <span>View Full Portfolio</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          <ProjectGrid limit={3} />
        </div>
      </section>

      {/* Why Choose Us & Stats Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-semibold tracking-widest text-gold uppercase">The Studio Standard</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal leading-tight font-bold">Why Discerning Clients Choose Hayagriva</h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed">
                We believe that interior design is more than layout styling—it is structural storytelling. We control the complete workflow, selecting raw timber logs directly, engineering frames in our CNC workshops, and finalizing upholstery down to the last millimeter.
              </p>
              <div className="pt-2">
                <Link href="/about" className="px-5 py-3 border border-charcoal/20 hover:border-gold hover:text-gold text-charcoal text-xs font-bold uppercase tracking-widest rounded-xl transition-colors">
                  Read Our Story
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 sm:gap-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-6 bg-warmcream/45 border border-gray-100 rounded-2xl flex flex-col justify-between h-40"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{stat.value}</div>
                      <div className="text-xs text-muted font-semibold mt-1">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-warmcream border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">Kind Words</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mt-2 mb-4 font-bold">Client Success Stories</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 px-6 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Design Session Booking</span>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight">Ready to Transform Your Space?</h3>
          <p className="max-w-xl mx-auto text-gray-400 text-sm sm:text-base">
            Consult our expert design engineers to receive customized sketches, layout layouts, and immediate estimates.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Link href="/contact" className="px-6 py-3.5 bg-gold hover:bg-white hover:text-charcoal text-white rounded-xl font-semibold transition-all duration-300 text-sm shadow-lg shadow-gold/25">
              Book Free Consultation
            </Link>
            <Link href="/services" className="px-6 py-3.5 border border-white/20 hover:border-white text-white rounded-xl font-semibold transition-colors text-sm">
              Calculate Project Budget
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
