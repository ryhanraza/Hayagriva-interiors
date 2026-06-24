'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { arr } from './section-utils'

// BeforeAfterSlider is a client-only component (uses pointer events), so load
// it dynamically to avoid SSR issues when rendered inside a server page.
const BeforeAfterSlider = dynamic(() => import('../BeforeAfterSlider'), { ssr: false })

// Before/after comparison slider.
// images = [{ url, label }] — images[0] = before, images[1] = after.
// Falls back to custom_json.beforeLabel / afterLabel for the captions.
export default function BeforeAfterSection({ section }) {
  const images = arr(section.images)
  const before = images[0]?.url
  const after = images[1]?.url

  // Don't render the slider without both images; show a graceful note instead.
  if (!before || !after) {
    return (
      <section className="py-28 px-6 max-w-4xl mx-auto text-center space-y-12">
        <Heading section={section} />
        <div className="rounded-3xl border border-dashed border-charcoal/10 py-16 text-xs uppercase tracking-widest text-charcoal/40">
          Add two images (before &amp; after) to display the comparison slider.
        </div>
      </section>
    )
  }

  return (
    <section className="py-28 px-6 max-w-4xl mx-auto text-center space-y-12">
      <Heading section={section} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden shadow-xl"
      >
        <BeforeAfterSlider
          beforeImage={before}
          afterImage={after}
          beforeLabel={images[0]?.label || section.custom_json?.beforeLabel || 'Before'}
          afterLabel={images[1]?.label || section.custom_json?.afterLabel || 'After'}
        />
      </motion.div>
    </section>
  )
}

function Heading({ section }) {
  return (
    <div className="space-y-3">
      {section.subtitle && (
        <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
      )}
      <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">{section.title}</h2>
      {(section.description || section.content) && (
        <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          {section.description || section.content}
        </p>
      )}
    </div>
  )
}
