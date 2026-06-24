'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Design Journal / blog teaser grid (about page section 4).
// custom_json.items = [{ title, category, date, image, desc, slug }]
export default function DesignJournalSection({ section }) {
  const items = arr(cfg(section, 'items', []))

  return (
    <section id="journal" className="py-24 px-6 max-w-7xl mx-auto border-t border-charcoal/5">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        {section.subtitle && (
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
        )}
        <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
        {(section.description || section.content) && (
          <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            {section.description || section.content}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((post, idx) => (
          <Link key={idx} href={`/blog/${post.slug}`} className="block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between bg-white rounded-2xl overflow-hidden border border-charcoal/5 hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-[460px]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-softgrey/10 shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-charcoal/80 backdrop-blur-md text-gold px-3 py-1.5 rounded-full border border-white/5">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-left">
                  <h4 className="text-lg font-bold font-serif text-charcoal group-hover:text-gold-dark transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-3">{post.desc}</p>
                </div>
                <div className="pt-4 border-t border-charcoal/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-charcoal/40 group-hover:text-gold transition-colors duration-300">
                  <span>{post.date}</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>Read Article</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  )
}
