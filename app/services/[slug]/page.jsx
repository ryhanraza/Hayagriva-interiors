'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Monitor,
  Paintbrush,
  Utensils,
  Bed,
  Sofa,
  PencilRuler,
  Sparkles,
  Grid3x3,
  Sun
} from 'lucide-react'

const servicesMap = {
  'modular-kitchen': {
    title: 'Modular Kitchen',
    tag: 'Culinary Engineering',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    gallery: 'Kitchen',
    desc: 'A high-performance kitchen designed around your workflow. We build custom modular setups incorporating premium soft-close drawer tracks, heavy-duty pull-out trays, and natural quartz countertops. Every cabinet and cabinet front is engineered to withstand daily use while presenting an immaculate, handleless aesthetic.',
    features: [
      'Custom modular layouts with precision cabinetry',
      'Quartz, marble & granite countertop surfaces',
      'Soft-close hinges and undermount drawer runners',
      'Under-cabinet LED illumination & task lighting',
      'Tall pantry units with pull-out baskets',
      'Concealed wiring and chimney integration'
    ],
    budget: '₹1.5L – ₹5L'
  },
  'bedroom': {
    title: 'Bedroom Interiors',
    tag: 'Serene Sanctuaries',
    icon: Bed,
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    gallery: 'Bedroom',
    desc: 'Transform your bedroom into a quiet retreat. Our designers custom craft floor-to-ceiling headboards, integrated floating nightstands, and walk-in wardrobe organizers with matte finishes. Lighting is layered seamlessly using dimmable LED coves and directional task spotlights to transition spatial mood effortlessly.',
    features: [
      'Floor-to-ceiling upholstered headboards',
      'Walk-in wardrobe organizers with modular drawers',
      'Floating nightstands & integrated shelving',
      'Layered mood coves with smart dimming',
      'Custom dressing vanities with accent mirrors',
      'Space-optimizing layouts for every room size'
    ],
    budget: '₹80K – ₹3L'
  },
  'living-room': {
    title: 'Living Room Design',
    tag: 'Grand Entertainment Lounges',
    icon: Sofa,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    gallery: 'Living Room',
    desc: 'Bespoke living environments made for social gathering and quiet comfort alike. We specialize in floating entertainment consoles, wood-paneled feature walls, and hand-plastered textured finishes. Every piece of furniture is scaled and positioned to optimize both architectural flow and everyday comfort.',
    features: [
      'Floating media consoles & entertainment units',
      'Custom wood-paneled feature walls',
      'Textured plaster & artistic wall finishes',
      'Bespoke seating configurations',
      'Integrated gallery display niches',
      'Built-in storage & display cabinetry'
    ],
    budget: '₹1L – ₹4L'
  },
  'space-planning': {
    title: 'Space Planning & 3D Design',
    tag: 'Visualize Before You Build',
    icon: PencilRuler,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
    gallery: '',
    desc: 'Professional space planning with photorealistic 3D renders to visualize your entire home before a single material is ordered. Our designers analyze traffic flow, natural light, and functional zones to create optimized layouts. You will see every angle, finish, and furnishing in cinematic 3D before construction begins.',
    features: [
      'Complete spatial layout & zone planning',
      'Photorealistic 3D interior renders',
      'Furniture placement & scale visualization',
      'Material palette & finish previews',
      'Electrical & plumbing point planning',
      'Unlimited revisions until you are satisfied'
    ],
    budget: '₹15K – ₹50K'
  }
}

export default function ServiceDetailPage() {
  const params = useParams()
  const service = servicesMap[params.slug]

  if (!service) {
    return (
      <div className="min-h-screen bg-warmcream flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-serif font-bold text-charcoal">Service Not Found</h1>
        <p className="text-charcoal/60 text-sm">The service you are looking for does not exist.</p>
        <Link href="/services" className="px-8 py-3 bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2">
          <ArrowLeft size={14} />
          <span>Back to Services</span>
        </Link>
      </div>
    )
  }

  const Icon = service.icon

  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-charcoal text-white overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/services" className="inline-flex items-center gap-2 text-beige/60 hover:text-gold text-xs font-semibold uppercase tracking-widest transition-colors mb-8">
              <ArrowLeft size={14} />
              <span>Back to All Services</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest">
                <Icon size={12} className="text-gold" />
                <span>{service.tag}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.15] font-extrabold text-white">
                {service.title}
              </h1>

              <p className="text-beige/70 text-sm sm:text-base max-w-lg leading-relaxed">
                {service.desc}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20"
                >
                  Book Consultation
                </Link>
                {service.gallery && (
                  <Link
                    href={`/portfolio?filter=${encodeURIComponent(service.gallery)}`}
                    className="px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
                  >
                    <span>View Portfolio</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[400px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">What We Deliver</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">Included in This Service</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {service.features.map((feature, idx) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex items-start gap-4 p-6 bg-white border border-charcoal/5 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={18} />
              </div>
              <span className="text-sm text-charcoal/80 leading-relaxed">{feature}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Budget Estimate */}
      <section className="py-16 px-6 bg-white border-t border-charcoal/5">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-warmcream border border-gold/15 rounded-3xl shadow-sm">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Starting Budget</span>
            <div className="text-3xl font-serif font-extrabold text-charcoal mt-1">{service.budget}</div>
          </div>
          <Link
            href="/contact"
            className="px-8 py-4 bg-gold hover:bg-charcoal text-charcoal hover:text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20 flex items-center gap-2 shrink-0"
          >
            <span>Get Free Quote</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-charcoal text-white rounded-[2.5rem] p-12 sm:p-16 relative overflow-hidden shadow-xl text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              Ready to Start Your {service.title} Project?
            </h3>
            <p className="max-w-xl mx-auto text-beige/60 text-xs sm:text-sm leading-relaxed">
              Schedule a complimentary consultation with our lead designers. We will prepare space blueprints, material samples, and project estimates tailored to your home.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20"
              >
                Book Free Consultation
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500"
              >
                All Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
