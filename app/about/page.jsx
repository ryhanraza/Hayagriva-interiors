'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sparkles,
  Star,
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2,
  Compass,
  ArrowRight
} from 'lucide-react'

// Features Grid Data (Why Choose Us)
const features = [
  {
    title: 'Experienced Designers',
    desc: 'Senior studio designers shape each home with precise balance and refined detail.',
    icon: Star
  },
  {
    title: 'Affordable Pricing',
    desc: 'Clear packages and value-driven sourcing keep luxury within reach without compromise.',
    icon: ShieldCheck
  },
  {
    title: 'End-to-End Service',
    desc: 'From mood boarding to installation, we manage every moment of the design journey.',
    icon: Layers
  },
  {
    title: 'On-Time Delivery',
    desc: 'Rigorous timelines and coordinated teams ensure projects finish on schedule.',
    icon: Clock
  },
  {
    title: 'Quality Materials',
    desc: 'We bring premium marbles, artisan woods, and luxury fixtures into every room.',
    icon: CheckCircle2
  },
  {
    title: 'Custom Designs',
    desc: 'Every interior is tailored to your lifestyle, layout, and lasting sense of luxury.',
    icon: Compass
  }
]

// Blog Posts Data (Design Journal)
const blogPosts = [
  {
    title: 'The Art of Japandi Minimalist Living',
    category: 'Aesthetics',
    date: 'June 12, 2026',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
    desc: 'Discover how to balance raw Scandinavian warmth with quiet Japanese simplicity to create an uncluttered, modern sanctuary.'
  },
  {
    title: 'Ergonomic Modular Kitchen Guidelines',
    category: 'Engineering',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    desc: 'An in-depth look at counter heights, modular layout workflows, soft-close hardware configurations, and material selections.'
  },
  {
    title: 'Layered Illumination for Private Suites',
    category: 'Lighting',
    date: 'April 15, 2026',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    desc: 'How to configure layered bedroom lighting using concealed warm coves, task spots, and smart dimming transitions.'
  }
]

export default function About() {
  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION (MATCH HOMEPAGE DARK HERO STYLE) */}
      <section className="relative bg-charcoal text-white overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span>Hayagriva Studio</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.15] font-extrabold text-white">
              Elegance, Craft, <br />
              and a Signature <br />
              <span className="text-gradient-gold italic font-normal">Design Approach.</span>
            </h1>
            
            <p className="text-beige/70 text-sm sm:text-base max-w-lg leading-relaxed">
              We design luxury interiors that feel warm, modern, and deeply personal. Every residential project is built to reflect your story, with thoughtful layout details, premium finishes, and turnkey timeline execution.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20"
              >
                Work With Us
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
              >
                <span>View Portfolio</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"
              alt="Premium residential suite design"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-6 text-left"
          >
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">OUR JOURNEY</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight max-w-xl">
              A boutique studio rooted in craftsmanship, layout optimization, and material honesty.
            </h2>
            <p className="text-sm text-charcoal/60 leading-relaxed max-w-xl">
              Hayagriva Interiors began with a desire to create residential sanctuaries that feel curated, calm, and unmistakably premium. We blend modern architecture with bespoke joinery, delivering homes that balance luxury with livability.
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed max-w-xl">
              Our approach is highly collaborative: we listen deeply to your spatial habits, draft precise plans, and oversee manufacture so the final result is both beautiful and built to last.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-6"
          >
            <div className="p-8 bg-white border border-charcoal/5 rounded-3xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500">
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">MISSION</span>
              <h3 className="mt-2 text-2xl font-serif font-bold text-charcoal">Design homes that feel personal and timeless.</h3>
              <p className="mt-4 text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                We create residential environments that elevate everyday rituals through intelligent layout configurations, layered lighting, and elegant joinery.
              </p>
            </div>
            <div className="p-8 bg-white border border-charcoal/5 rounded-3xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500">
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">VISION</span>
              <h3 className="mt-2 text-2xl font-serif font-bold text-charcoal">The first choice for luxurious residential interiors.</h3>
              <p className="mt-4 text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                We aspire to define new standards of premium home design across the region with every project we deliver, from conceptual sketches to key handover.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 bg-white border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">WHY CHOOSE US</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">The Trusted Choice for Discerning Homeowners</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-warmcream border border-charcoal/5 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-2xl bg-charcoal/5 text-gold border border-charcoal/5 flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-gold group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-charcoal mb-3">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. DESIGN JOURNAL / BLOG SECTION (REPLACES TEAM & STATS) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-charcoal/5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">DESIGN JOURNAL</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">Bespoke Interior Insights</h2>
          <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Read our principal designers' guides on material selections, layouts, lighting, and styling aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-charcoal/5 hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-[460px]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-softgrey/10 shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-charcoal/80 backdrop-blur-md text-gold px-3 py-1.5 rounded-full border border-white/5">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-left">
                  <h4 className="text-lg font-bold font-serif text-charcoal group-hover:text-gold-dark transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-3">
                    {post.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-charcoal/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-charcoal/40 group-hover:text-gold transition-colors duration-300">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>Read Article</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CTA BANNER (MATCH HOMEPAGE CTA STYLE) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-charcoal/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-charcoal text-white rounded-[2.5rem] p-12 sm:p-16 relative overflow-hidden shadow-xl text-center"
        >
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Design Consultation</span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              Ready to Design Your Haven?
            </h3>
            <p className="text-beige-luxury/60 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Schedule a design session with our principal architects. We will discuss spatial blueprints, sample material palettes, and immediately compute customized site estimates.
            </p>
            <div className="pt-4 flex justify-center gap-4 flex-wrap">
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold transition-all duration-500 text-xs uppercase tracking-widest shadow-lg shadow-gold/20 rounded-full flex items-center gap-2 group"
              >
                <span>Book Consultation</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
