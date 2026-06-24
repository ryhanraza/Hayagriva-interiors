'use client'

import WhyChooseHayagriva from '../WhyChooseHayagriva'
import { cfg } from './section-utils'

// "Why choose" section. Wraps the shared WhyChooseHayagriva component so the
// curated feature set stays consistent across pages. Heading + variant are
// editable; defaults match the original home usage.
export default function WhyChooseSection({ section }) {
  const heading = section.title || cfg(section, 'heading', 'Why Homeowners Trust Hayagriva')
  const variant = cfg(section, 'variant', 'light')
  return <WhyChooseHayagriva variant={variant} heading={heading} />
}
