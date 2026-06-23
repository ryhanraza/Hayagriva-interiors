'use client'

import { motion } from 'framer-motion'
import {
  Star,
  ShieldCheck,
  Layers,
  Clock,
  CheckCircle2,
  Compass
} from 'lucide-react'

// Why Choose Us feature cards — shared across every page so the value
// proposition stays consistent. Mirrors the styling already used in
// about-view.jsx so it feels native to the existing design system.
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

/**
 * Reusable "Why Choose Hayagriva" section.
 *
 * @param {Object} props
 * @param {'light'|'cream'} [props.variant='light']  Background variant so the
 *   section contrasts cleanly with whatever sits above it on each page.
 * @param {string} [props.heading]  Optional override for the section heading.
 */
export default function WhyChooseHayagriva({ variant = 'light', heading }) {
  const isLight = variant === 'light'

  return (
    <section className={`py-24 px-6 ${isLight ? 'bg-white border-y border-charcoal/5' : 'bg-warmcream'}`}>
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">WHY CHOOSE US</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">
            {heading || 'The Trusted Choice for Discerning Homeowners'}
          </h2>
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
                className="group bg-white border border-charcoal/5 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500"
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
  )
}
