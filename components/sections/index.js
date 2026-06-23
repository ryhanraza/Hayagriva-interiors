// ── Section renderer registry ──────────────────────────────────
//
// Each export is a React component that receives `{ section }` — a raw
// page_sections row from the database. DynamicSections imports this map
// and switches on `section.type`.
//
// To add a new section type:
//   1. Create components/sections/MyTypeSection.jsx
//   2. Add it to SECTION_RENDERERS below
//   3. Add the type name to the admin <select> in dashboard page
//   4. Seed data can reference it

export { default as HeroSection } from './HeroSection'
export { default as StatsSection } from './StatsSection'
export { default as ServicesPreviewSection } from './ServicesPreviewSection'
export { default as ProcessTimelineSection } from './ProcessTimelineSection'
export { default as BeforeAfterSection } from './BeforeAfterSection'
export { default as RoomDesignsSection } from './RoomDesignsSection'
export { default as FeaturedProjectsSection } from './FeaturedProjectsSection'
export { default as TestimonialsSection } from './TestimonialsSection'
export { default as WhyChooseSection } from './WhyChooseSection'
export { default as FaqSection } from './FaqSection'
export { default as CtaSection } from './CtaSection'
export { default as DesignJournalSection } from './DesignJournalSection'
export { default as AboutStorySection } from './AboutStorySection'
export { default as ServicesGridSection } from './ServicesGridSection'
export { default as DetailedServicesSection } from './DetailedServicesSection'
export { default as PricingSection } from './PricingSection'
export { default as ContactSection } from './ContactSection'
export { default as PortfolioGridSection } from './PortfolioGridSection'
export { default as CraftStandardsSection } from './CraftStandardsSection'

// Flat lookup map — consumed by DynamicSections.
export { default as CustomSection } from '../DynamicSections'

import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import ServicesPreviewSection from './ServicesPreviewSection'
import ProcessTimelineSection from './ProcessTimelineSection'
import BeforeAfterSection from './BeforeAfterSection'
import RoomDesignsSection from './RoomDesignsSection'
import FeaturedProjectsSection from './FeaturedProjectsSection'
import TestimonialsSection from './TestimonialsSection'
import WhyChooseSection from './WhyChooseSection'
import FaqSection from './FaqSection'
import CtaSection from './CtaSection'
import DesignJournalSection from './DesignJournalSection'
import AboutStorySection from './AboutStorySection'
import ServicesGridSection from './ServicesGridSection'
import DetailedServicesSection from './DetailedServicesSection'
import PricingSection from './PricingSection'
import ContactSection from './ContactSection'
import PortfolioGridSection from './PortfolioGridSection'
import CraftStandardsSection from './CraftStandardsSection'
import CustomSection from './CustomFallback'

export const SECTION_RENDERERS = {
  hero: HeroSection,
  stats: StatsSection,
  'services-preview': ServicesPreviewSection,
  'process-timeline': ProcessTimelineSection,
  'before-after': BeforeAfterSection,
  'room-designs': RoomDesignsSection,
  'featured-projects': FeaturedProjectsSection,
  testimonials: TestimonialsSection,
  'why-choose': WhyChooseSection,
  faq: FaqSection,
  cta: CtaSection,
  'design-journal': DesignJournalSection,
  'about-story': AboutStorySection,
  'services-grid': ServicesGridSection,
  'detailed-services': DetailedServicesSection,
  pricing: PricingSection,
  contact: ContactSection,
  'portfolio-grid': PortfolioGridSection,
  'craft-standards': CraftStandardsSection,
  custom: CustomSection,
}

/** List of all valid type names for the admin editor <select>. */
export const SECTION_TYPES = Object.keys(SECTION_RENDERERS)
