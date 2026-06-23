'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ProjectGrid from '../ProjectGrid'

/**
 * Portfolio Grid Section — renders the interactive category-filter project grid.
 *
 * This is the portfolio-specific equivalent of the `featured-projects` section
 * but includes the horizontal filter bar (All / Kitchen / Bedroom / Living Room)
 * and uses the live ProjectGrid component that fetches from the projects API.
 *
 * custom_json fields:
 *   - categories: string[] (optional, defaults to ['All','Kitchen','Bedroom','Living Room'])
 */
export default function PortfolioGridSection({ section }) {
  const categories = section?.custom_json?.categories || ['All', 'Kitchen', 'Bedroom', 'Living Room']

  return (
    <Suspense fallback={<PortfolioGridSkeleton />}>
      <PortfolioGridInner categories={categories} />
    </Suspense>
  )
}

function PortfolioGridSkeleton() {
  return (
    <section className="py-0 px-6 bg-warmcream">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center gap-4 mb-12">
          {['All', 'Kitchen', 'Bedroom', 'Living Room'].map((cat) => (
            <div key={cat} className="h-11 w-28 rounded-full bg-charcoal/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0,1,2].map((i) => (
            <div key={i} className="h-[320px] rounded-2xl bg-charcoal/5 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

function PortfolioGridInner({ categories }) {
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
      setFilter(categories.find((cat) => cat.toLowerCase() === filterParam.toLowerCase()))
    } else if (!filterParam) {
      setFilter('All')
    }
  }, [filterParam, categories])

  function handleFilterChange(cat) {
    setFilter(cat)
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'All') {
      params.delete('filter')
    } else {
      params.set('filter', cat)
    }
    const qs = params.toString()
    router.replace(qs ? `/portfolio?${qs}` : '/portfolio', { scroll: false })
  }

  return (
    <section className="py-0 px-6 bg-warmcream">
      <div className="max-w-7xl mx-auto">

        {/* Category Filter Bar */}
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

        {/* Project Grid */}
        <ProjectGrid filter={filter} />

      </div>
    </section>
  )
}
