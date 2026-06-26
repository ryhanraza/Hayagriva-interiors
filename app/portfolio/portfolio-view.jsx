'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProjectGrid from '../../components/ProjectGrid'
import BeforeAfterSlider from '../../components/BeforeAfterSlider'
import { motion } from 'framer-motion'
import { Layers, Lightbulb, Hammer, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import WhyChooseHayagriva from '../../components/WhyChooseHayagriva'
import FAQ from '../../components/FAQ'
import { portfolioFaqs } from '../../lib/faq-data'

export default function Portfolio({ content = {} }) {
  const heroSection = content['hero'] || {}
  const ctaSection  = content['cta']  || {}

  const pageTitle       = heroSection.title       || 'Our Projects'
  const pageDescription = heroSection.description ||
    'Explore a curated gallery of kitchen, bedroom, and living room transformations with rich imagery, smooth interactions, and immersive details.'
  const ctaHeading      = ctaSection.title        || 'Ready to Design Your Haven?'
  const ctaDescription  = ctaSection.description  ||
    'Schedule a design session with our principal architects. We will discuss spatial blueprints, sample material palettes, and immediately compute customized site estimates.'

  const categories = ['All', 'Kitchen', 'Bedroom', 'Living Room']
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')

  const [filter, setFilter] = useState(() => {
    if (filterParam && categories.some((cat) => cat.toLowerCase() === filterParam.toLowerCase())) {
      return categories.find((cat) => cat.toLowerCase() === filterParam.toLowerCase())
    }
    return 'All'
  })

  useEffect(() => {
    if (filterParam && categories.some((cat) => cat.toLowerCase() === filterParam.toLowerCase())) {
      const matchedCategory = categories.find((cat) => cat.toLowerCase() === filterParam.toLowerCase())
      setFilter(matchedCategory)
    } else if (!filterParam) {
      setFilter('All')
    }
  }, [filterParam])

  const handleFilterChange = (cat) => {
    setFilter(cat)
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'All') {
      params.delete('filter')
    } else {
      params.set('filter', cat)
    }
    const queryString = params.toString()
    router.replace(queryString ? `/portfolio?${queryString}` : '/portfolio', { scroll: false })
  }

  const standards = [
    {
      title: 'Precision Joinery',
      desc: 'Matte lacquered MDF panels, natural white oak veneers, and premium soft-close runners engineered for seamless daily luxury.',
      icon: Layers
    },
    {
      title: 'Lighting Integration',
      desc: 'Concealed warm LED diffusers, custom task lights, and smart dimming spots built to sculpt and transition spatial mood.',
      icon: Lightbulb
    },
    {
      title: 'Material Honesty',
      desc: 'Selected Calacatta marble slabs, hand-plastered textured walls, and brushed brass details designed to age beautifully.',
      icon: Hammer
    }
  ]

  return (
    <div className="bg-warmcream text-charcoal min-h-screen py-16 px-6 sm:py-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Section 1: Hero & Filter Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-bold tracking-widest text-gold uppercase inline-flex items-center gap-1.5"
          >
            <Sparkles size={12} className="text-gold" /> Portfolio Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-charcoal mt-4 mb-6 font-black leading-tight"
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-charcoal/60 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
          >
            {pageDescription}
          </motion.p>
        </div>

        {/* Section 2: Horizontal Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className="relative px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] transition-all duration-300 rounded-full border border-charcoal/10 bg-white/70 hover:border-gold/40 hover:bg-white"
              style={{ color: filter === cat ? '#FAF8F5' : '#1A1917' }}
            >
              {filter === cat && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-gold rounded-full shadow-lg shadow-gold/15"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Section 3: Responsive Project Grid */}
        <ProjectGrid filter={filter} />

        {/* Section 4: Interactive Before/After Visual Comparison */}
        <div className="my-28 sm:my-36 border-t border-charcoal/10 pt-24 max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Visual Transformation</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">The Art of Metamorphosis</h2>
            <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Drag the center slider handle to compare an empty measurement shell structure with our finalized bespoke turnkey layout.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-charcoal/5"
          >
            <BeforeAfterSlider 
              beforeImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop"
              afterImage="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
              beforeLabel="Before: Empty Shell Structure"
              afterLabel="After: Finished Luxury Suite"
            />
          </motion.div>
        </div>

        {/* Section 5: Craftsmanship Standards */}
        <div className="my-28 sm:my-36 border-t border-charcoal/10 pt-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Bespoke Engineering</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">Our Studio Standards</h2>
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              We focus on material integrity and everyday ergonomics, engineering high-end environments built to last.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {standards.map((std, idx) => {
              const Icon = std.icon
              return (
                <motion.div
                  key={std.title}
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

        {/* Section 6: Why Choose Hayagriva */}
        <WhyChooseHayagriva variant="light" heading="Why Homeowners Trust Hayagriva" />

        {/* Section 7: FAQ */}
        <FAQ faqs={portfolioFaqs} variant="cream" heading="Portfolio Questions, Answered" />

        {/* Section 8: Full-Width Architectural CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-charcoal text-white rounded-[2.5rem] p-12 sm:p-16 relative overflow-hidden mt-24 sm:mt-32 shadow-xl text-center"
        >
          {/* Subtle gold radial backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Design Consultation</span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-white">
              {ctaHeading}
            </h3>
            <p className="text-beige-luxury/60 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              {ctaDescription}
            </p>
            <div className="pt-4 flex justify-center gap-4 flex-wrap">
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold transition-all duration-500 text-xs uppercase tracking-widest shadow-lg shadow-gold/20 rounded-full flex items-center gap-2 group"
              >
                <span>Book Consultation</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
