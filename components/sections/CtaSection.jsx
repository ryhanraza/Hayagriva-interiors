'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Call-to-action banner. Two variants via custom_json.variant:
//   - 'rounded' : inset rounded card on a light page (about/contact style)
//   - default   : full-bleed charcoal band (home style)
// Buttons come from the section.buttons array; the first is primary.
export default function CtaSection({ section }) {
  const variant = cfg(section, 'variant', 'full')
  const bgImg = arr(section.images)[0]?.url || ''
  const buttons = arr(section.buttons)

  if (variant === 'rounded') {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-charcoal/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-charcoal text-white rounded-[2.5rem] p-12 sm:p-16 relative overflow-hidden shadow-xl text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          <CtaBody section={section} buttons={buttons} />
        </motion.div>
      </section>
    )
  }

  // Full-bleed variant
  return (
    <section id="consultation" className="py-24 px-6 bg-charcoal text-white relative overflow-hidden">
      {bgImg && (
        <div className="absolute inset-0 z-0">
          <Image src={bgImg} alt="CTA Background" fill className="object-cover opacity-15" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <CtaBody section={section} buttons={buttons} />
      </div>
    </section>
  )
}

function CtaBody({ section, buttons }) {
  return (
    <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
      {section.subtitle && (
        <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
      )}
      <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight font-extrabold text-white">
        {section.title}
      </h3>
      {(section.description || section.content) && (
        <p className="max-w-xl mx-auto text-beige/60 text-xs sm:text-sm leading-relaxed">
          {section.description || section.content}
        </p>
      )}
      {buttons.length > 0 && (
        <div className="pt-4 flex justify-center gap-4 flex-wrap">
          {buttons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.link || '#'}
              className={
                idx === 0
                  ? 'px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold transition-all duration-500 text-xs uppercase tracking-widest shadow-lg shadow-gold/20 rounded-full inline-flex items-center gap-2 group'
                  : 'px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold transition-all duration-500 text-xs uppercase tracking-widest rounded-full inline-flex items-center gap-2 group'
              }
            >
              <span>{btn.text}</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
