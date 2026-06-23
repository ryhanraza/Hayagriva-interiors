'use client'

import { motion } from 'framer-motion'
import { Layers, Lightbulb, Hammer, Palette, Ruler, Wrench, Paintbrush, Blocks } from 'lucide-react'
import { cfg, arr } from './section-utils'

// Icon lookup by name (string from DB) so admins can pick icons via text.
const ICON_MAP = {
  Layers, Lightbulb, Hammer, Palette, Ruler, Wrench, Paintbrush, Blocks,
  CheckCircle2: Layers,  // alias fallbacks
  Sparkles: Lightbulb,
  Clock: Ruler,
  ShieldCheck: Blocks,
}

/**
 * Craft Standards Section — displays a grid of craftsmanship/quality cards.
 *
 * custom_json.items = [{ title, desc, icon? }]
 */
export default function CraftStandardsSection({ section }) {
  const items = arr(cfg(section, 'items', [
    {
      title: 'Precision Joinery',
      desc: 'Matte lacquered MDF panels, natural white oak veneers, and premium soft-close runners engineered for seamless daily luxury.',
      icon: 'Layers'
    },
    {
      title: 'Lighting Integration',
      desc: 'Concealed warm LED diffusers, custom task lights, and smart dimming spots built to sculpt and transition spatial mood.',
      icon: 'Lightbulb'
    },
    {
      title: 'Material Honesty',
      desc: 'Selected Calacatta marble slabs, hand-plastered textured walls, and brushed brass details designed to age beautifully.',
      icon: 'Hammer'
    }
  ]))

  return (
    <section className="py-28 px-6 bg-warmcream">
      <div className="max-w-6xl mx-auto border-t border-charcoal/10 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
          {section.description && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              {section.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((std, idx) => {
            const Icon = ICON_MAP[std.icon] || Layers
            return (
              <motion.div
                key={std.title || idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group p-8 bg-white border border-charcoal/5 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold/30 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-charcoal/5 text-gold border border-charcoal/5 flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                  <Icon size={20} />
                </div>
                <h4 className="text-lg font-bold font-serif text-charcoal mb-3 group-hover:text-gold-dark transition-colors duration-300">
                  {std.title}
                </h4>
                <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed group-hover:text-charcoal/80 transition-colors duration-300">
                  {std.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
