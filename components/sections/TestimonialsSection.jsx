'use client'

import HomeTestimonials from '../HomeTestimonials'

// Testimonials section. Renders the shared HomeTestimonials carousel inside
// the section's heading chrome. The carousel itself pulls live Google reviews,
// so no per-section data is needed beyond the heading fields.
export default function TestimonialsSection({ section }) {
  return (
    <section className="py-28 px-6 bg-warmcream">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">
            {section.title || 'What Our Clients Say'}
          </h2>
          {(section.description || section.content) && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">
              {section.description || section.content}
            </p>
          )}
        </div>
        <HomeTestimonials />
      </div>
    </section>
  )
}
