'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Featured projects highlight grid (home page section 8).
// custom_json.items = [{ title, type, budget, image, category, desc }]
export default function FeaturedProjectsSection({ section }) {
  const items = arr(cfg(section, 'items', []))
  const viewAllLink = cfg(section, 'viewAllLink', '/portfolio')

  return (
    <section className="py-28 bg-white border-y border-charcoal/5 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl space-y-3">
            {section.subtitle && (
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
            )}
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors flex items-center gap-2 group shrink-0"
            >
              <span>View Full Portfolio</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((p, idx) => (
            <Link
              key={idx}
              href={`/portfolio?filter=${encodeURIComponent(p.category || '')}`}
              className="group flex flex-col justify-between bg-warmcream rounded-2xl overflow-hidden border border-charcoal/5 hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-[480px]"
            >
              <div className="relative h-64 w-full overflow-hidden bg-softgrey/10 shrink-0">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {p.type && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-charcoal/80 backdrop-blur-md text-gold px-3 py-1.5 rounded-full border border-white/5">
                      {p.type}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xl font-bold font-serif text-charcoal group-hover:text-gold-dark transition-colors duration-300">
                    {p.title}
                  </h4>
                  <p className="text-xs text-charcoal/50 leading-relaxed font-semibold">
                    {p.desc || 'Fine timber panels, bespoke configurations, custom layout styling.'}
                  </p>
                </div>
                <div className="pt-6 border-t border-charcoal/5 flex justify-between items-center mt-4">
                  <div>
                    <div className="text-[9px] text-charcoal/40 uppercase tracking-widest">Est. Budget</div>
                    <div className="text-sm font-bold text-gold-dark mt-0.5">{p.budget}</div>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-gold flex items-center gap-1.5 transition-colors">
                    <span>Case Details</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
