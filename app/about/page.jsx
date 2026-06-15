'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Compass, Gem, Heart, Trophy, Target, Award } from 'lucide-react'

export default function About() {
  const values = [
    {
      title: 'Uncompromised Quality',
      desc: 'We source only premium hardwood, Italian marbles, and luxury textile weaves, ensuring heirloom-grade durability.',
      icon: Gem
    },
    {
      title: 'Tailored Creativity',
      desc: 'We do not follow template blueprints. Every space is built from a blank slate to align with your lifestyle.',
      icon: Compass
    },
    {
      title: 'Total Transparency',
      desc: 'We offer granular quotes with zero hidden pricing, keeping you informed on material specifications and progress.',
      icon: Heart
    }
  ]

  const milestones = [
    {
      year: '2015',
      title: 'Studio Foundation',
      desc: 'Hayagriva Interiors was founded as a boutique carpentry workshop with a small team of master craftsmen and a vision for premium organic living.'
    },
    {
      year: '2018',
      title: 'Own Modular Production Unit',
      desc: 'We established our custom woodworking facility in Bangalore, allowing us to control tolerances down to 0.5mm.'
    },
    {
      year: '2021',
      title: '150+ Turnkey Homes Delivered',
      desc: 'Expanded our operations to provide complete design-and-build styling services across South India.'
    },
    {
      year: '2024',
      title: 'Architectural Excellence Award',
      desc: 'Recognized for our sustainable and warm minimalist designs at the National Design Excellence Conclave.'
    }
  ]

  return (
    <div className="py-24 bg-warmcream min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">About Our Studio</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-charcoal mt-2 mb-4">Crafting Timeless Legacies</h1>
          <p className="text-muted text-sm sm:text-base">
            Learn about our design philosophies, custom manufacturing standards, and the milestones that define our studio.
          </p>
        </div>

        {/* Narrative & Founder Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
          
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-charcoal font-bold">From Forest to Floor: Sourcing Noble Materials</h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              We believe that the soul of an interior lies in the authenticity of its materials. We reject synthetic veneers and quick-assembly composites. Instead, we source grade-A solid timber, natural Italian marbles, and custom-woven brass accents directly from sustainable reserves.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              In our state-of-the-art production unit, these raw materials undergo precise CNC milling and hand-finished sanding. By combining advanced industrial machinery with traditional carpentry techniques, we construct furniture and joinery that withstand the test of time, both structurally and aesthetically.
            </p>
            
            <div className="p-6 bg-beige rounded-2xl border border-gold/10 inline-flex items-center gap-4">
              <div className="w-12 h-12 bg-gold/15 rounded-full flex items-center justify-center text-gold shrink-0">
                <Award size={22} />
              </div>
              <div>
                <div className="text-sm font-semibold text-charcoal">Registered Architecture Studio</div>
                <div className="text-xs text-muted">Licenced council of architects Karnataka</div>
              </div>
            </div>
          </div>

          {/* Founder Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative w-full h-[400px]"
          >
            {/* Framed border */}
            <div className="absolute inset-0 rounded-[30px] overflow-hidden border-8 border-white shadow-xl bg-gray-50">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop"
                alt="Bespoke furniture crafting and design curation at Hayagriva studio"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
            
            {/* Profile Tag */}
            <div className="absolute -bottom-4 -right-4 bg-charcoal text-white px-6 py-4 rounded-2xl shadow-lg">
              <div className="font-serif text-base text-gold">Design Studio</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Where Concept Meets Creation</div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <section className="mb-24">
          <h3 className="text-2xl font-serif text-charcoal font-bold text-center mb-12">Our Design Philosophy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-lg font-serif font-semibold text-charcoal mb-3">{val.title}</h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Milestones Vertical Timeline */}
        <section>
          <h3 className="text-2xl font-serif text-charcoal font-bold text-center mb-16">Studio Milestones</h3>
          
          <div className="relative border-l border-gold/25 max-w-3xl mx-auto pl-8 sm:pl-12 space-y-12">
            {milestones.map((milestone, idx) => (
              <motion.div 
                key={milestone.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] sm:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-gold border-4 border-warmcream flex items-center justify-center shadow-sm" />
                
                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-all">
                  <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {milestone.year}
                  </span>
                  <h4 className="text-lg font-serif font-semibold text-charcoal mt-3 mb-2">{milestone.title}</h4>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
