'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, DollarSign, Tag, Loader2 } from 'lucide-react'

export default function ProjectGrid({ filter = 'All' }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        if (Array.isArray(data)) {
          // Only keep projects that have a usable image URL
          setProjects(
            data.filter(
              (p) => p && typeof p.image === 'string' && p.image.trim()
            )
          )
        }
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-charcoal/50">
        <Loader2 className="animate-spin text-gold" size={36} />
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-gold-mute">Loading Projects...</span>
      </div>
    )
  }

  // Filter projects by category
  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((project) => project.category === filter)

  const displayedProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProjects.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  // Staggered grid container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <div className="space-y-16">
      {/* Responsive Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {displayedProjects.map((project, index) => {
            const aspectClass = 'aspect-[1/1]'
            const imageSrc =
              project.image && typeof project.image === 'string' && project.image.trim()
                ? project.image
                : null

            return (
              <motion.div
                layout
                key={project.id}
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="group relative block overflow-hidden rounded-[1.8rem] border border-charcoal/10 bg-white/50 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-gold/30"
              >
                <Link href={`/projects/${project.id}`} className="block h-full w-full">
                  <div className={`relative w-full ${aspectClass} overflow-hidden bg-charcoal/5`}>

                    {/* Project Image with Zoom Transition */}
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={project.title}
                        fill
                        priority={index < 3}
                        className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-charcoal/10 text-charcoal/30">
                        <span className="text-[10px] uppercase tracking-widest font-bold">No Image</span>
                      </div>
                    )}

                    {/* Dark Hover Overlay */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-end p-6 sm:p-8">

                      {/* Project Card Info */}
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] space-y-4">
                        <div>
                          {/* Project Type */}
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.25em] text-gold font-bold mb-1">
                            <Tag size={10} /> {project.category}
                          </span>

                          {/* Project Name */}
                          <h3 className="text-xl sm:text-2xl font-serif text-white font-black leading-tight">
                            {project.title}
                          </h3>
                        </div>

                        {/* Location and Budget Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] uppercase tracking-widest text-white/80">
                          <span>{project.location.split(',')[0]}</span>
                          <span className="inline-flex items-center gap-0.5 text-gold font-bold">
                            <DollarSign size={12} /> {project.budget}
                          </span>
                        </div>

                        {/* Interactive prompt */}
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold font-bold pt-1">
                          <span>View Project Case</span>
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="px-8 py-4 border border-charcoal/20 bg-white hover:bg-gold hover:text-white hover:border-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-sm"
          >
            Load More Projects
          </button>
        </div>
      )}
    </div>
  )
}
