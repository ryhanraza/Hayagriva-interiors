'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ChevronRight, CheckCircle2, Shield, Heart } from 'lucide-react'
import HomeTestimonials from './HomeTestimonials'

export default function DynamicSections({ sections }) {
  if (!sections || sections.length === 0) return null

  return (
    <div className="space-y-0">
      {sections.map((section, idx) => {
        if (!section.is_visible) return null

        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id || idx} section={section} />
          case 'about':
            return <AboutSection key={section.id || idx} section={section} />
          case 'services':
            return <ServicesSection key={section.id || idx} section={section} />
          case 'portfolio':
            return <PortfolioSection key={section.id || idx} section={section} />
          case 'testimonials':
            return <TestimonialsSection key={section.id || idx} section={section} />
          case 'cta':
            return <CtaSection key={section.id || idx} section={section} />
          case 'custom':
          default:
            return <CustomSection key={section.id || idx} section={section} />
        }
      })}
    </div>
  )
}

// ── 1. HERO SECTION ───────────────────────────────────
function HeroSection({ section }) {
  const bgImg = section.images?.[0]?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1800&auto=format&fit=crop'
  const isSplit = section.layout === 'split'

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-charcoal text-white overflow-hidden pt-32 pb-20 px-6">
      {/* Background Image / Overlay */}
      {!isSplit && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={bgImg} 
            alt={section.title || 'Hero Background'} 
            fill
            priority
            className="object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className={isSplit ? "lg:col-span-6 space-y-8 text-left" : "lg:col-span-8 space-y-8 text-left"}>
          {section.subtitle && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span>{section.subtitle}</span>
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight font-extrabold text-white"
          >
            {section.title}
          </motion.h1>

          {(section.description || section.content) && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-beige/70 text-sm sm:text-base max-w-lg leading-relaxed"
            >
              {section.description || section.content}
            </motion.p>
          )}

          {section.buttons && section.buttons.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {section.buttons.map((btn, bIdx) => {
                const isPrimary = bIdx === 0
                return (
                  <Link 
                    key={bIdx}
                    href={btn.link || '#'}
                    className={
                      isPrimary
                        ? "px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg"
                        : "px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
                    }
                  >
                    <span>{btn.text}</span>
                    {!isPrimary && <ChevronRight size={14} />}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </div>

        {isSplit && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative h-[450px] w-full rounded-3xl overflow-hidden border border-white/10"
          >
            <Image 
              src={bgImg} 
              alt={section.title || 'Hero Illustration'} 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ── 2. ABOUT SECTION ──────────────────────────────────
function AboutSection({ section }) {
  const isSplit = section.layout === 'split'
  const imgUrl = section.images?.[0]?.url || 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop'

  return (
    <section className="py-28 px-6 bg-warmcream text-charcoal overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className={isSplit ? "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" : "space-y-12 max-w-3xl mx-auto text-center"}>
          
          <div className="space-y-6">
            {section.subtitle && (
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
            )}
            <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">{section.title}</h2>
            
            {(section.description || section.content) && (
              <p className="text-charcoal/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {section.description || section.content}
              </p>
            )}

            {section.buttons && section.buttons.length > 0 && (
              <div className="pt-4 flex gap-4">
                {section.buttons.map((btn, bIdx) => (
                  <Link 
                    key={bIdx}
                    href={btn.link || '#'}
                    className="px-6 py-3 bg-charcoal hover:bg-gold text-white hover:text-charcoal text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300"
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About Image / Visual Frame */}
          {isSplit && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[480px] rounded-3xl overflow-hidden shadow-xl border border-gold/10"
            >
              <Image 
                src={imgUrl} 
                alt={section.title || 'About Visual'} 
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {!isSplit && section.images && section.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {section.images.map((img, iIdx) => (
                <div key={iIdx} className="relative h-64 rounded-2xl overflow-hidden shadow-md">
                  <Image src={img.url} alt={`Gallery ${iIdx}`} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

// ── 3. SERVICES SECTION ───────────────────────────────
function ServicesSection({ section }) {
  // If images or items are defined in custom_json, we can display them as services,
  // else render generic items.
  const servicesItems = section.custom_json?.items || [
    { title: 'Bespoke Layouts', desc: 'Bespoke layouts tailored specifically to your room contours.' },
    { title: 'Turnkey Installation', desc: 'Flawless execution supervised from design drafts to key handovers.' },
    { title: 'Premium Sourcing', desc: 'Only premium oak, granite, veneers, and soft-close mechanisms used.' }
  ]

  return (
    <section className="py-28 px-6 bg-white text-charcoal">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">{section.title}</h2>
          {section.description && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">{section.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesItems.map((item, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-warmcream border border-gold/15 rounded-2xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-serif font-bold">
                  {idx + 1}
                </div>
                <h4 className="text-xl font-bold font-serif text-charcoal">{item.title}</h4>
                <p className="text-xs text-charcoal/60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 4. PORTFOLIO SECTION ──────────────────────────────
function PortfolioSection({ section }) {
  const images = section.images || []

  return (
    <section className="py-28 px-6 bg-warmcream text-charcoal">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">{section.title}</h2>
          {section.description && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">{section.description}</p>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img, idx) => (
              <div key={idx} className="group relative h-[350px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-8">
                <Image src={img.url} alt={`Portfolio ${idx}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="relative z-20 space-y-1 text-white">
                  <h4 className="text-xl font-serif font-bold">{img.caption || section.title || 'Bespoke Space'}</h4>
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest">Premium Handover</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-xs text-charcoal/40">No projects added to this section yet.</div>
        )}
      </div>
    </section>
  )
}

// ── 5. TESTIMONIALS SECTION ───────────────────────────
function TestimonialsSection({ section }) {
  return (
    <section className="py-28 px-6 bg-warmcream text-charcoal">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">{section.title || 'Client Testimonials'}</h2>
          {section.description && (
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">{section.description}</p>
          )}
        </div>

        <HomeTestimonials />
      </div>
    </section>
  )
}

// ── 6. CTA SECTION ────────────────────────────────────
function CtaSection({ section }) {
  const bgImg = section.images?.[0]?.url || ''
  
  return (
    <section className="relative py-24 px-6 bg-charcoal text-white overflow-hidden text-center">
      {bgImg && (
        <div className="absolute inset-0 z-0">
          <Image src={bgImg} alt="CTA Background" fill className="object-cover opacity-15" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {section.subtitle && (
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
        )}
        <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold leading-tight">{section.title}</h3>
        {(section.description || section.content) && (
          <p className="max-w-xl mx-auto text-beige/70 text-xs sm:text-sm leading-relaxed">
            {section.description || section.content}
          </p>
        )}

        {section.buttons && section.buttons.length > 0 && (
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            {section.buttons.map((btn, idx) => (
              <Link 
                key={idx}
                href={btn.link || '#'}
                className={
                  idx === 0
                    ? "px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold transition-all duration-500 text-xs uppercase tracking-widest shadow-lg shadow-gold/20 rounded-full"
                    : "px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold transition-all duration-500 text-xs uppercase tracking-widest rounded-full"
                }
              >
                {btn.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ── 7. CUSTOM SECTION ─────────────────────────────────
function CustomSection({ section }) {
  const layoutClass = 
    section.layout === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
      : section.layout === 'split'
      ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
      : 'space-y-6 text-center max-w-4xl mx-auto'

  return (
    <section className="py-28 px-6 bg-white text-charcoal">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          {section.subtitle && (
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">{section.subtitle}</span>
          )}
          <h2 className="text-3xl font-serif font-bold text-charcoal">{section.title}</h2>
        </div>

        <div className={layoutClass}>
          <div className="space-y-6">
            {(section.description || section.content) && (
              <p className="text-charcoal/70 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left">
                {section.description || section.content}
              </p>
            )}

            {section.buttons && section.buttons.length > 0 && (
              <div className="flex gap-4">
                {section.buttons.map((btn, idx) => (
                  <Link 
                    key={idx}
                    href={btn.link || '#'}
                    className="px-6 py-3 bg-charcoal hover:bg-gold text-white hover:text-charcoal text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300"
                  >
                    {btn.text}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {section.images && section.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.images.map((img, idx) => (
                <div key={idx} className="relative h-48 rounded-xl overflow-hidden shadow-sm">
                  <Image src={img.url} alt={`Custom ${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
