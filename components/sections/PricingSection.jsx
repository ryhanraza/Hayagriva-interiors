'use client'

import { motion } from 'framer-motion'
import { cfg, arr } from './section-utils'

// Pricing guide cards (services page section 4).
// custom_json.items = [{ title, range, desc }]
export default function PricingSection({ section }) {
  const items = arr(cfg(section, 'items', []))
  return (
    <section className="py-24 px-6 bg-warmcream border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          {section.subtitle && <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>}
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
          {(section.description || section.content) && <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">{section.description || section.content}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((guide, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }} className="group p-8 bg-white border border-charcoal/5 rounded-3xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500 flex flex-col justify-between">
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
  )
}
