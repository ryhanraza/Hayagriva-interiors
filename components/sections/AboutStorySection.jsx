'use client'

import { motion } from 'framer-motion'
import { cfg, arr } from './section-utils'

// About "Our Story" section: a two-column layout with narrative copy on the
// left and a stack of value cards (Mission / Vision) on the right.
// custom_json.cards = [{ label, heading, body }]
// section.content / description hold the narrative paragraphs; the renderer
// splits content on blank lines so admins can keep multi-paragraph copy in a
// single field.
export default function AboutStorySection({ section }) {
  return <AboutStorySectionImpl section={section} />
}

function AboutStorySectionImpl({ section }) {
  const cards = arr(cfg(section, 'cards', []))
  const paragraphs = (section.content || section.description || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6 text-left"
        >
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight max-w-xl">
            {section.title}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-charcoal/60 leading-relaxed max-w-xl">
              {p}
            </p>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid gap-6"
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-8 bg-white border border-charcoal/5 rounded-3xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500"
            >
              {card.label && (
                <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{card.label}</span>
              )}
              <h3 className="mt-2 text-2xl font-serif font-bold text-charcoal">{card.heading}</h3>
              {card.body && <p className="mt-4 text-xs sm:text-sm text-charcoal/60 leading-relaxed">{card.body}</p>}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
