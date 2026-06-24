'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Utensils, Bed, Sofa, PencilRuler, KeyRound, Hammer,
  ClipboardList, Palette, ShieldCheck, Users, Headphones, Clock,
  Truck, Wrench, PaintBucket, Ruler, Lamp, BookOpen
} from 'lucide-react'
import { cfg, arr } from './section-utils'

// Lucide icon registry — keep in sync with the admin editor's icon picker.
const ICONS = {
  Utensils, Bed, Sofa, PencilRuler, KeyRound, Hammer, ClipboardList, Palette,
  ShieldCheck, Users, Headphones, Clock, Truck, Wrench, PaintBucket, Ruler,
  Lamp, BookOpen, ArrowRight
}

export default function ServicesPreviewSection({ section }) {
  const items = arr(cfg(section, 'items', []))
  const viewAllLink = cfg(section, 'viewAllLink', '/services')

  return (
    <section className="py-28 px-6 max-w-6xl mx-auto">
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
            <span>View All Services</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, idx) => {
          const Icon = ICONS[item.icon] || Sofa
          return (
            <Link key={idx} href={item.href || item.link || '#'} className="group relative block h-[300px] cursor-pointer">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-8 bg-white border border-gold/15 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold transition-all duration-500 overflow-hidden flex flex-col justify-between h-full"
              >
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[3px] bg-gold transition-all duration-500" />
                <div>
                  <div className="w-12 h-12 bg-gold-light/40 text-gold border border-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-charcoal font-serif group-hover:text-gold-dark transition-colors duration-300">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed mt-3 group-hover:text-charcoal/80 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explore Design</span>
                  <ArrowRight size={10} />
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
