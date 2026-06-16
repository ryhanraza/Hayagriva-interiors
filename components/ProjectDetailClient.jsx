'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Layers, Calendar, DollarSign, Hammer } from 'lucide-react'

export default function ProjectDetailClient({ project }) {
  // Parse materials list if comma-separated
  const materialsList = project.materials
    ? project.materials.split(',').map((m) => m.trim())
    : []

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <div className="bg-warmcream min-h-screen text-charcoal px-6 py-20 sm:py-28 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-glow pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-charcoal/70 hover:text-gold transition-colors duration-300 mb-10 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-transform duration-300 text-gold" />
            Back to Portfolio
          </Link>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start"
        >
          {/* Visual Showcase Card */}
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-[2.2rem] border border-charcoal/5 shadow-lg bg-white group relative"
          >
            <div className="relative h-[420px] sm:h-[560px] overflow-hidden bg-charcoal/5">
              {/* Subtle image bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
              
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                className="object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {/* Quick Stats Image Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap gap-2.5">
              <span className="backdrop-blur-md bg-white/85 border border-charcoal/5 rounded-full px-4 py-2 text-[10px] uppercase tracking-wider text-gold-dark font-bold shadow-sm">
                {project.category}
              </span>
              <span className="backdrop-blur-md bg-white/85 border border-charcoal/5 rounded-full px-4 py-2 text-[10px] uppercase tracking-wider text-charcoal font-bold shadow-sm flex items-center gap-1.5">
                <MapPin size={12} className="text-gold" /> {project.location}
              </span>
            </div>
          </motion.div>

          {/* Details Column */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8 lg:sticky lg:top-28">
            <div>
              {/* Breadcrumb / Category */}
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-dark">
                Bespoke Design Studio
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-black leading-tight text-charcoal">
                {project.title}
              </h1>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-charcoal/70 font-light">
                {project.desc}
              </p>
            </div>

            {/* Budget & Location cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-charcoal/5 bg-white p-5 shadow-sm">
                <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal/45 mb-1.5 flex items-center gap-1">
                  <DollarSign size={11} className="text-gold" /> Est. Budget
                </p>
                <p className="text-lg font-bold text-charcoal tracking-wide">{project.budget}</p>
              </div>
              <div className="rounded-2xl border border-charcoal/5 bg-white p-5 shadow-sm">
                <p className="text-[9px] uppercase tracking-[0.25em] text-charcoal/45 mb-1.5 flex items-center gap-1">
                  <MapPin size={11} className="text-gold" /> Location
                </p>
                <p className="text-lg font-bold text-charcoal tracking-wide">{project.location.split(',')[0]}</p>
              </div>
            </div>

            {/* Project Specifications */}
            <div className="space-y-4 rounded-2xl border border-charcoal/5 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 text-charcoal/60">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal/5 text-gold border border-charcoal/5 shrink-0">
                  <Layers size={16} />
                </span>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-charcoal/45">Area / Dimension</div>
                  <div className="mt-0.5 text-xs sm:text-sm font-bold text-charcoal">{project.area || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-charcoal/60 border-t border-charcoal/5 pt-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal/5 text-gold border border-charcoal/5 shrink-0">
                  <Calendar size={16} />
                </span>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-charcoal/45">Project Year</div>
                  <div className="mt-0.5 text-xs sm:text-sm font-bold text-charcoal">{project.year || '2024'}</div>
                </div>
              </div>
            </div>

            {/* Materials Used Tag Cloud */}
            {materialsList.length > 0 && (
              <div className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-charcoal/45 mb-4 flex items-center gap-1.5 font-bold">
                  <Hammer size={12} className="text-gold" /> Materials Palette
                </h3>
                <div className="flex flex-wrap gap-2">
                  {materialsList.map((material) => (
                    <span
                      key={material}
                      className="text-[10px] font-semibold tracking-wider text-charcoal bg-charcoal/5 hover:bg-gold/10 border border-charcoal/10 hover:border-gold/30 px-3 py-1.5 rounded-lg transition-colors duration-300"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Design philosophy light box */}
            <div className="rounded-2xl border border-gold/25 bg-gold/5 p-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold-dark mb-2.5 font-bold">
                Aesthetic Direction
              </h3>
              <p className="text-xs leading-relaxed text-charcoal/70">
                Crafted to integrate functionality with material honesty. Every curve, joinery detail, and finish is selected to establish a refined domestic retreat, ensuring the spatial story remains timeless.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
