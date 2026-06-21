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
    }, 3000)
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
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' }
    })
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto py-6">
      
      {/* Testimonial Container */}
      <div className="relative overflow-hidden bg-charcoal-luxury/60 border border-white/5 backdrop-blur-md rounded-3xl p-8 sm:p-14 min-h-[300px] sm:min-h-[260px] flex flex-col justify-between shadow-2xl">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-metallic/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Quote & Stars */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="text-gold-metallic opacity-20">
            <Quote size={48} fill="currentColor" />
          </div>
          <div className="flex gap-1.5 text-gold-metallic">
            {[...Array(5)].map((_, idx) => (
              <Star key={idx} size={15} fill="currentColor" />
            ))}
          </div>
        </div>

        {/* Animated Text Content */}
        <div className="relative flex-1 z-10">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.blockquote
              key={testimonials[i].id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-base sm:text-xl italic text-beige-luxury font-serif leading-relaxed"
            >
              "{testimonials[i].text}"
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Author Details & Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-10 pt-8 border-t border-white/5 relative z-10">
          <div>
            <div className="font-bold text-beige-luxury font-serif text-lg tracking-wide">{testimonials[i].author}</div>
            <div className="text-xs text-gold-mute uppercase tracking-widest font-semibold mt-1">{testimonials[i].role}</div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-white/10 hover:border-gold-metallic hover:text-gold-metallic flex items-center justify-center transition-all duration-300 text-beige-luxury bg-white/5 hover:bg-white/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-white/10 hover:border-gold-metallic hover:text-gold-metallic flex items-center justify-center transition-all duration-300 text-beige-luxury bg-white/5 hover:bg-white/10"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Dots Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > i ? 1 : -1)
              setI(idx)
            }}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              idx === i ? 'w-8 bg-gold-metallic' : 'w-2.5 bg-white/10 hover:bg-white/30'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
