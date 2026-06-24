'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Room-wise designs grid (home page section 6).
// custom_json.items = [{ name, image, filter, tag }]
export default function RoomDesignsSection({ section }) {
  const items = arr(cfg(section, 'items', []))

  return (
    <section className="py-28 bg-white border-y border-charcoal/5 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
          {(section.description || section.content) && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">
              {section.description || section.content}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((room, idx) => (
            <Link
              key={idx}
              href={`/portfolio?filter=${encodeURIComponent(room.filter || room.name || '')}`}
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-8 border border-charcoal/5 hover:border-gold/30 hover:shadow-xl transition-all duration-500"
            >
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10" />
              <div className="relative z-20 space-y-2">
                {room.tag && (
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest bg-gold-light/10 border border-gold/20 px-2.5 py-1 rounded-full inline-block backdrop-blur-md">
                    {room.tag}
                  </span>
                )}
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-serif text-white font-bold">{room.name}</h4>
                  <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-gold text-white group-hover:text-charcoal flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-gold">
                    <ArrowUpRight size={16} />
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
