'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Services overview grid (services page). Portfolio-style cards.
// custom_json.items = [{ title, desc, image, slug, filter }]
export default function ServicesGridSection({ section }) {
  const items = arr(cfg(section, 'items', []))
  return (
    <section id="services-overview" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        {section.subtitle && <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>}
        <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
        {(section.description || section.content) && <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">{section.description || section.content}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((s, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }} className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md cursor-pointer border border-charcoal/5 hover:border-gold/30 hover:shadow-xl transition-all duration-500">
            <Link href={`/services/${s.slug || '#'}`} className="absolute inset-0 z-30">
              <Image src={s.image} alt={s.title} fill className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent z-10" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15" />
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                {s.filter && <span className="text-[9px] font-bold text-gold uppercase tracking-widest bg-gold-light/10 border border-gold/20 px-2.5 py-1 rounded-full inline-block backdrop-blur-md">Bespoke Space</span>}
                <h4 className="text-2xl font-serif text-white font-bold">{s.title}</h4>
                {s.desc && <p className="text-[11px] text-white/70 leading-normal line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{s.desc}</p>}
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gold font-bold pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"><span>Explore designs</span><ArrowRight size={10} /></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
