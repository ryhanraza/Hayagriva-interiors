'use client'
import { useState } from 'react'
import ProjectGrid from '../../components/ProjectGrid'
import { motion } from 'framer-motion'

export default function Portfolio() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Residential', 'Commercial', 'Kitchens']

  return (
    <div className="max-w-6xl mx-auto py-24 px-6 min-h-screen">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold tracking-widest text-gold uppercase"
        >
          Our Showcase
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-serif text-charcoal mt-2 mb-4"
        >
          Selected Creations
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted text-sm sm:text-base leading-relaxed"
        >
          Browse through our residential, commercial, and modular kitchen designs. Every space represents a journey of collaboration, luxury, and meticulous attention to detail.
        </motion.p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="relative px-6 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 rounded-full"
            style={{ color: filter === cat ? '#FAF8F5' : '#1A1917' }}
          >
            {filter === cat && (
              <motion.div
                layoutId="activeFilterBg"
                className="absolute inset-0 bg-charcoal rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <ProjectGrid filter={filter} />
    </div>
  )
}
