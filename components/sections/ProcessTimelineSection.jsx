'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  ClipboardList, PencilRuler, Palette, Hammer, KeyRound,
  Users, Headphones, Clock, ShieldCheck, Truck, Wrench, BookOpen
} from 'lucide-react'
import { cfg, arr } from './section-utils'

const ICONS = {
  ClipboardList, PencilRuler, Palette, Hammer, KeyRound,
  Users, Headphones, Clock, ShieldCheck, Truck, Wrench, BookOpen
}

// "How it works" — a 5-step timeline plus an optional highlight features row.
// custom_json.steps    = [{ step: '01', title, desc, icon }]
// custom_json.highlights = [{ title, desc, icon }]  (rendered below the timeline)
export default function ProcessTimelineSection({ section }) {
  const steps = arr(cfg(section, 'steps', []))
  const highlights = arr(cfg(section, 'highlights', []))

  return (
    <section className="py-28 bg-white border-y border-charcoal/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-24 space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
          {(section.description || section.content) && (
            <p className="text-charcoal/60 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              {section.description || section.content}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-0" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-4 relative z-10">
            {steps.map((item, idx) => {
              const Icon = ICONS[item.icon] || ClipboardList
              const isLast = idx === steps.length - 1
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-warmcream border border-gold/20 flex items-center justify-center text-gold shadow-sm group-hover:shadow-[0_12px_40px_-8px_rgba(197,162,83,0.45)] group-hover:-translate-y-2 group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                      <Icon size={26} strokeWidth={1.6} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-charcoal text-gold rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-gold/40 shadow-md">
                      {item.step || String(idx + 1).padStart(2, '0')}
                    </span>
                    {!isLast && (
                      <div className="hidden lg:flex absolute top-1/2 -right-[calc(50%+8px)] -translate-y-1/2 text-gold/40 z-20">
                        <ChevronRight size={18} />
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h4 className="text-base sm:text-lg font-serif font-bold text-charcoal mb-2 group-hover:text-gold-dark transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-charcoal/55 leading-relaxed max-w-[200px]">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Highlight features row */}
        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-28 pt-16 border-t border-charcoal/5"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {highlights.map((item, idx) => {
                const Icon = ICONS[item.icon] || Clock
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-2xl bg-warmcream border border-gold/15 hover:border-gold/40 hover:shadow-[0_12px_40px_-12px_rgba(197,162,83,0.4)] transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gold/20 text-gold flex items-center justify-center shrink-0 shadow-sm group-hover:bg-gold group-hover:text-white transition-all duration-300">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h5 className="text-sm font-bold text-charcoal font-serif">{item.title}</h5>
                      <p className="text-[11px] text-charcoal/50 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
