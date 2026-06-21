'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Briefcase, Mail, MapPin, ArrowRight } from 'lucide-react'

const openings = [
  {
    title: 'Senior Interior Designer',
    department: 'Design Studio',
    location: 'Visakhapatnam, AP',
    type: 'Full-time',
    description: 'Lead residential projects from conceptual mood boards to final spatial styling, managing client briefs and supervising detailed CAD drawings.'
  },
  {
    title: '3D Visualizer',
    department: 'Visualization & Rendering',
    location: 'Visakhapatnam, AP',
    type: 'Full-time',
    description: 'Create ultra-realistic 3D walkthroughs and high-fidelity renders of modular kitchens, wardrobes, and luxury living spaces.'
  },
  {
    title: 'Project Coordinator',
    department: 'Site Execution',
    location: 'Visakhapatnam, AP',
    type: 'Full-time',
    description: 'Oversee site execution, coordinate with joiners and carpenters, manage material deliveries, and ensure strict compliance with architectural timelines.'
  }
]

export default function CareersView() {
  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden">
      {/* 1. Hero Banner */}
      <section className="relative bg-charcoal text-white overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest mx-auto"
          >
            <Sparkles size={12} className="text-gold animate-pulse" />
            <span>Join Our Team</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold leading-tight text-white"
          >
            Crafting Luxury Spaces <br />
            Requires a <span className="text-gradient-gold italic font-normal">Signature Team.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-beige/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
          >
            We are always looking for passionate designers, meticulous project coordinators, and creative visualizers who take pride in turnkey execution.
          </motion.p>
        </div>
      </section>

      {/* 2. Openings Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Current Openings</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">Explore Career Opportunities</h2>
          </div>

          <div className="space-y-6">
            {openings.map((job, idx) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-charcoal/5 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-4 max-w-2xl text-left">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gold/10 text-gold px-2.5 py-1 rounded">
                      {job.department}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-charcoal/5 text-charcoal/60 px-2.5 py-1 rounded flex items-center gap-1">
                      <Briefcase size={10} /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-charcoal">{job.title}</h3>
                  <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed">{job.description}</p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0 text-left md:text-right">
                  <div className="text-xs text-charcoal/40 flex items-center md:justify-end gap-1 mb-2">
                    <MapPin size={12} className="text-gold" /> {job.location}
                  </div>
                  <Link
                    href={`mailto:interiorsbyhayagriva@gmail.com?subject=Application for ${job.title}`}
                    className="px-6 py-3.5 bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. General Application Callout */}
      <section className="py-16 px-6 max-w-4xl mx-auto pb-24">
        <div className="bg-charcoal text-white rounded-[2rem] p-10 relative overflow-hidden text-center shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">General Application</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Don't see your role?</h3>
            <p className="text-beige-luxury/60 text-xs sm:text-sm leading-relaxed">
              We are always on the lookout for fresh talent. Email us your portfolio and resume, and we will get in touch when a relevant opening arises.
            </p>
            <div className="pt-2">
              <a
                href="mailto:interiorsbyhayagriva@gmail.com?subject=General Inquiry - Careers"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-md"
              >
                <Mail size={14} />
                <span>Submit Portfolio</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
