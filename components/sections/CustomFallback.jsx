'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { arr } from './section-utils'

// Generic fallback for any section type that doesn't have a dedicated renderer.
// Reads title, subtitle, description/content, images, buttons, and layout.
export default function CustomSection({ section }) {
  const layoutClass =
    section.layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      : section.layout === 'split'
      ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
      : 'space-y-6 text-center max-w-4xl mx-auto'

  return (
    <section className="py-28 px-6 bg-white text-charcoal">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          {section.subtitle && <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>}
          <h2 className="text-3xl font-serif font-bold text-charcoal">{section.title}</h2>
        </div>
        <div className={layoutClass}>
          <div className="space-y-6">
            {(section.description || section.content) && (
              <p className="text-charcoal/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left">
                {section.description || section.content}
              </p>
            )}
            {arr(section.buttons).length > 0 && (
              <div className="flex gap-4">
                {arr(section.buttons).map((btn, idx) => (
                  <Link key={idx} href={btn.link || '#'} className="px-6 py-3 bg-charcoal hover:bg-gold text-white hover:text-charcoal text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300">{btn.text}</Link>
                ))}
              </div>
            )}
          </div>
          {arr(section.images).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {arr(section.images).map((img, idx) => (
                <div key={idx} className="relative h-48 rounded-xl overflow-hidden shadow-sm">
                  <Image src={img.url} alt={`Custom ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
