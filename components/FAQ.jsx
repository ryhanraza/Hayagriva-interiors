'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Reusable FAQ accordion with FAQPage JSON-LD structured data for Google
 * rich results.
 *
 * @param {Object} props
 * @param {Array<{question: string, answer: string}>} props.faqs  Q&A pairs.
 * @param {'light'|'cream'} [props.variant='cream']  Background variant.
 * @param {string} [props.heading]  Optional override for the section heading.
 */
export default function FAQ({ faqs, variant = 'cream', heading = 'Frequently Asked Questions' }) {
  const [openIndex, setOpenIndex] = useState(0)
  const isLight = variant === 'light'

  // FAQPage JSON-LD — Google can surface these Q&As directly in search results.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <section className={`py-24 px-6 ${isLight ? 'bg-white border-t border-charcoal/5' : 'bg-warmcream'}`}>
      {/* Structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">{heading}</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.question}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-gold/40 bg-white shadow-lg'
                    : 'border-charcoal/5 bg-white hover:border-gold/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left p-6 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold font-serif text-charcoal pr-4">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? 'bg-gold text-white' : 'bg-charcoal/5 text-gold'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 -mt-1 text-xs sm:text-sm text-charcoal/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
