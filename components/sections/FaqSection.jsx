'use client'

import FAQ from '../FAQ'
import {
  homeFaqs, aboutFaqs, servicesFaqs, portfolioFaqs, contactFaqs
} from '../../lib/faq-data'
import { cfg, arr } from './section-utils'

// Named FAQ sets shipped in code (lib/faq-data.js). The section can either:
//  - reference a set by name via custom_json.faqSet (e.g. 'home'), OR
//  - carry its own inline items via custom_json.items ([{question, answer}]).
// Inline items win, so admins can fully override a set without touching code.
const NAMED_SETS = {
  home: homeFaqs,
  about: aboutFaqs,
  services: servicesFaqs,
  portfolio: portfolioFaqs,
  contact: contactFaqs
}

export default function FaqSection({ section }) {
  const inlineItems = arr(cfg(section, 'items', []))
  const setName = cfg(section, 'faqSet', 'home')

  const faqs =
    inlineItems.length > 0
      ? inlineItems.map((i) => ({ question: i.question, answer: i.answer }))
      : NAMED_SETS[setName] || homeFaqs

  const heading = section.title || cfg(section, 'heading', 'Frequently Asked Questions')
  const variant = cfg(section, 'variant', 'cream')

  return <FAQ faqs={faqs} variant={variant} heading={heading} />
}
