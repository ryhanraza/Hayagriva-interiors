'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Alternating detailed services (services page section 3).
// custom_json.items = [{ title, tag, desc, image, features: string[] }]
// Rows alternate image-left / image-right automatically.
export default function DetailedServicesSection({ section }) {
  const items = arr(cfg(section, 'items', []))
  return (
    <section className="py-24 px-6 bg-white border-t border-charcoal/5">
      <div className="max-w-7xl mx-auto space-y-28">
        {items.map((service, idx) => {
          const isReversed = idx % 2 === 1
          return (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: isReversed ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={`relative h-[380px] sm:h-[450px] w-full rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-xl ${isReversed ? 'md:order-last' : ''}`}>
                <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: isReversed ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
                {service.tag && <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{service.tag}</span>}
                <h3 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{service.title}</h3>
                <p className="text-charcoal/70 text-sm sm:text-base leading-relaxed">{service.desc}</p>
                {arr(service.features).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-charcoal/5">
                    {arr(service.features).map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-gold shrink-0" /><span className="text-xs sm:text-sm font-semibold text-charcoal/80">{f}</span></div>
                    ))}
                  </div>
                )}
                <div className="pt-4">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal hover:border-gold hover:bg-gold hover:text-white text-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300"><span>Get Estimate</span><ArrowRight size={12} /></Link>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
