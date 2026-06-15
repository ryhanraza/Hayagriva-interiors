'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    text: 'In budget-sensitive areas like Gajuwaka, I’ve seen Hayagriva deliver high-quality interiors without overspending. Clients are often surprised by how premium their flats look post-design. Easily the best interior designers in Vizag for affordable homes.',
    author: 'Yerra Kalyani',
    role: 'Gajuwaka'
  },
  {
    id: 2,
    text: 'Hayagriva’s kitchen renovator team in Yendada delivered our modular kitchen right on schedule. They balanced space optimization and aesthetics perfectly. Their reliable project timelines really back their claim as top interior designers in Vizag.',
    author: 'Nooki Naidu',
    role: 'Yendada'
  },
  {
    id: 3,
    text: 'We hired Hayagriva as a full interior construction contractor for our 3BHK near NAD Junction. They managed structural changes, false ceilings, and interior décor impeccably. Professional coordination and smooth handover. Real contenders for best interior designers in Vizag.',
    author: 'Ramana Bokam',
    role: 'NAD Junction'
  },
  {
    id: 4,
    text: 'For our Maddilapalem 2BHK, Hayagriva acted as a full interior construction contractor—electricals, partitions, decorative finishes, everything. They offered end‑to‑end service, and delivered with care. Great choice if you\'re after the best interior designers in Vizag.',
    author: 'Kiran Gompa',
    role: 'Maddilapalem'
  },
  {
    id: 5,
    text: 'As an interior decorator, Hayagriva pulled off a soothing, artistic theme for my Seethammadhara living room — custom wall panels, coordinated soft furnishings, and ambient lighting. Definitely among the top interior designers in Visakhapatnam.',
    author: 'Guna',
    role: 'Seethammadhara'
  }
]

export default function TestimonialCarousel() {
  const [i, setI] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [i])

  const handleNext = () => {
    setDirection(1)
    setI((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setI((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeIn' }
    })
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto py-6">
      
      {/* Testimonial Container */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-md p-8 sm:p-12 min-h-[280px] sm:min-h-[220px] flex flex-col justify-between">
        
        {/* Quote & Stars */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-gold opacity-20">
            <Quote size={40} fill="currentColor" />
          </div>
          <div className="flex gap-1 text-gold">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} size={14} fill="currentColor" />
            ))}
          </div>
        </div>

        {/* Animated Text Content */}
        <div className="relative flex-1">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.blockquote
              key={testimonials[i].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-base sm:text-lg italic text-charcoal font-serif leading-relaxed"
            >
              "{testimonials[i].text}"
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Author Details & Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <div>
            <div className="font-semibold text-charcoal font-serif">{testimonials[i].author}</div>
            <div className="text-xs text-muted uppercase tracking-wider mt-0.5">{testimonials[i].role}</div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gold hover:text-gold flex items-center justify-center transition-colors text-charcoal"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-200 hover:border-gold hover:text-gold flex items-center justify-center transition-colors text-charcoal"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Dots Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > i ? 1 : -1)
              setI(idx)
            }}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              idx === i ? 'w-6 bg-gold' : 'w-2 bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
