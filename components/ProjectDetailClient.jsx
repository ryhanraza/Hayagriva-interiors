'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Layers, Calendar, DollarSign, Hammer, X } from 'lucide-react'

export default function ProjectDetailClient({ project, gallery = [] }) {
  const [lightbox, setLightbox] = useState(null)
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

        {/* Project Gallery — additional pictures */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 sm:mt-32"
          >
            <div className="text-center mb-12 space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">
                Visual Tour
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-charcoal font-bold leading-tight">
                Project Gallery
              </h2>
              <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                More angles and details from this {project.category.toLowerCase()} project.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {gallery.map((img, idx) => (
                <motion.button
                  key={img.id}
                  type="button"
                  onClick={() => setLightbox(img)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`relative overflow-hidden rounded-2xl border border-charcoal/5 bg-charcoal/5 group cursor-zoom-in ${
                    idx === 0 ? 'col-span-2 sm:col-span-2 row-span-2 aspect-[2/1] sm:aspect-square' : 'aspect-square'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || `${project.title} ${idx + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <img
                src={lightbox.image_url}
                alt={lightbox.caption || project.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {lightbox.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm">{lightbox.caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
