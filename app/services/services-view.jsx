'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import WhyChooseHayagriva from '../../components/WhyChooseHayagriva'
import FAQ from '../../components/FAQ'
import { servicesFaqs } from '../../lib/faq-data'

// Core Services Grid Data
const coreServices = [
    {
    title: 'Modular Kitchen',
    desc: 'Precision cabinetry, natural stone countertops, and intelligent storage layouts.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop',
    slug: 'modular-kitchen',
    filter: 'Kitchen'
  },
  {
    title: 'Bedroom Interiors',
    desc: 'Calm suites with luxury headboards, custom walk-in closets, and ambient lighting.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1000&auto=format&fit=crop',
    slug: 'bedroom',
    filter: 'Bedroom'
  },
  {
    title: 'Living Room Design',
    desc: 'Elegant lounges blending tailored furniture, floating consoles, and custom walls.',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1000&auto=format&fit=crop',
    slug: 'living-room',
    filter: 'Living Room'
  },
  {
    title: 'Space Planning & 3D Design',
    desc: 'Professional layouts with photorealistic renders before construction begins.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop',
    slug: 'space-planning',
    filter: ''
  },
  {
    title: 'Turnkey Interiors',
    desc: 'Complete interior solutions from design to execution.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000&auto=format&fit=crop',
    slug: 'turnkey-solutions',
    filter: ''
  },
  {
    title: 'Renovation',
    desc: 'Revitalize your existing spaces with expert remodeling and structural upgrades.',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1000&auto=format&fit=crop',
    slug: 'renovation',
    filter: ''
  }
]

// Detailed Alternating Services Data
const detailedServices = [
  {
    title: 'Modular Kitchen',
    tag: 'Culinary Engineering',
    desc: 'A high-performance kitchen designed around your workflow. We build custom modular setups incorporating premium soft-close drawer tracks, heavy-duty pull-out trays, and natural quartz countertops. Every cabinet and cabinet front is engineered to withstand daily use while presenting an immaculate, handleless aesthetic.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    features: ['Custom modular layouts', 'Quartz & marble counters', 'Soft-close hardware', 'Under-cabinet illumination']
  },
  {
    title: 'Bedroom Interiors',
    tag: 'Serene Sanctuaries',
    desc: 'Transform your bedroom into a quiet retreat. Our designers custom craft floor-to-ceiling headboards, integrated floating nightstands, and walk-in wardrobe organizers with matte finishes. Lighting is layered seamlessly using dimmable LED coves and directional task spotlights to transition spatial mood effortlessly.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    features: ['Ergonomic wardrobe systems', 'Custom upholstered headboards', 'Layered mood coves', 'Space-optimizing layouts']
  },
  {
    title: 'Living Room Design',
    tag: 'Grand Entertainment Lounges',
    desc: 'Bespoke living environments made for social gathering and quiet comfort alike. We specialize in floating entertainment consoles, wood-paneled feature walls, and hand-plastered textured finishes. Every piece of furniture is scaled and positioned to optimize both architectural flow and everyday comfort.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    features: ['Floating media cabinetry', 'Textured plaster finishes', 'Bespoke seating configurations', 'Integrated gallery display units']
  },
  {
    title: 'Office Interiors',
    tag: 'Refined Workspaces',
    desc: 'Productive home offices and study spaces that feel sophisticated and focused. We blend modern ergonomic standards with high-end materials like American walnut and anodized aluminum. Hidden cable organizer ducts, custom task lighting, and acoustic felt backing ensure a clean, distraction-free environment.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    features: ['Walnut veneer executive desks', 'Concealed wiring systems', 'Acoustic felt paneling', 'Smart storage & floating shelves']
  },
  {
    title: 'Turnkey Interiors',
    tag: 'End-to-End Execution',
    desc: 'A single-source, hassle-free engagement where we handle every stage of your project — from concept and 3D design to procurement, civil works, carpentry, and final handover. One dedicated project manager, one timeline, one accountable team delivering your complete home, move-in ready.',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
    features: ['Single-point project ownership', 'Design + civil + execution in-house', 'Dedicated project manager & timeline', 'Move-in ready final handover']
  },
  {
    title: 'Renovation',
    tag: 'Breathe New Life',
    desc: 'Transform your existing home without starting from scratch. Our renovation expertise covers structural modifications, layout reconfigurations, bathroom and kitchen makeovers, flooring upgrades, and complete aesthetic overhauls. We assess the existing structure, reinforce where needed, and deliver a refreshed space that feels entirely new.',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200&auto=format&fit=crop',
    features: ['Structural modifications & layout reconfigurations', 'Kitchen & bathroom makeovers', 'Flooring, tiling & plumbing upgrades', 'Complete aesthetic overhauls & repainting']
  }
]

// Pricing hints
const pricingGuides = [
  {
    title: 'Modular Kitchen',
    range: '₹1.5L – ₹5L',
    desc: 'Starting range for custom layouts, high-moisture resistant plywood, acrylic/laminate shutters, and soft-close hardware.'
  },
  {
    title: 'Bedroom Interiors',
    range: '₹80K – ₹3L',
    desc: 'Includes custom double bed, master sliding wardrobe with modular internal drawers, bedside units, and mood lighting coves.'
  },
  {
    title: 'Living Room Design',
    range: '₹1L – ₹4L',
    desc: 'Covers television floating unit, custom wood paneling, wall niches, styling moldings, and built-in storage solutions.'
  }
]

export default function ServicesPage() {
  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden pt-28">

      {/* 2. SERVICES GRID (PORTFOLIO STYLE CARDS) */}
      <section id="services-overview" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">DESIGN SPECIALTIES</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">Curated Solutions for Your Home</h2>
          <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Click to explore room layouts designed to match your individual standard of daily comfort and luxurious spacing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {coreServices.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md cursor-pointer border border-charcoal/5 hover:border-gold/30 hover:shadow-xl transition-all duration-500"
            >
              <Link href={`/services/${service.slug}`} className="absolute inset-0 z-30">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15" />
                
                <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest bg-gold-light/10 border border-gold/20 px-2.5 py-1 rounded-full inline-block backdrop-blur-md">
                    Bespoke Space
                  </span>
                  <h4 className="text-2xl font-serif text-white font-bold">{service.title}</h4>
                  <p className="text-[11px] text-white/70 leading-normal line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {service.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold font-bold pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span>Explore designs</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DETAILED SERVICES (IMAGE-FOCUSED + ALTERNATING LAYOUTS) */}
      <section className="py-24 px-6 bg-white border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto space-y-28">
          {detailedServices.map((service, idx) => {
            const isReversed = idx % 2 === 1
            return (
              <div
                key={service.title}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {/* Image side */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative h-[380px] sm:h-[450px] w-full rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-xl ${isReversed ? 'md:order-last' : ''}`}
                >
                  <Image
                    src={service.image}
                    alt={`${service.title} detailing`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>

                {/* Text side */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{service.tag}</span>
                  <h3 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{service.title}</h3>
                  <p className="text-charcoal/70 text-sm sm:text-base leading-relaxed">{service.desc}</p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-charcoal/5">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-gold shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-charcoal/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal hover:border-gold hover:bg-gold hover:text-white text-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300"
                    >
                      <span>Get Estimate</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. PRICING HINTS */}
      <section className="py-24 px-6 bg-warmcream border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">TRANSPARENT ESTIMATES</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">Starting Pricing Guide</h2>
            <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              We provide transparent cost estimations up front to align layout goals with material preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingGuides.map((guide, idx) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-8 bg-white border border-charcoal/5 rounded-3xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gold uppercase block mb-1">Estimated Starting Price</span>
                  <h4 className="text-xl font-bold font-serif text-charcoal mb-4">{guide.title}</h4>
                  <div className="text-3xl font-serif font-extrabold text-gold-dark mb-4">{guide.range}</div>
                  <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">{guide.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE HAYAGRIVA */}
      <WhyChooseHayagriva variant="light" heading="Why Homeowners Trust Hayagriva" />

      {/* 6. FAQ */}
      <FAQ faqs={servicesFaqs} variant="cream" heading="Services & Pricing Questions" />

    </div>
  )
}
