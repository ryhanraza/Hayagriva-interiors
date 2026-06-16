'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    text: "In budget-sensitive areas like Gajuwaka, I’ve seen Hayagriva deliver high-quality interiors without overspending. Clients are often surprised by how premium their flats look post-design. Easily the best interior designers in Vizag for affordable luxury.",
    author: "Yerra Kalyani",
    role: "Gajuwaka Flat Owner",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 2,
    text: "Hayagriva’s kitchen renovator team in Yendada delivered our modular kitchen right on schedule. They balanced space optimization and aesthetics perfectly. Their reliable project timelines really back their claim as top interior designers in Vizag.",
    author: "Nooki Naidu",
    role: "Yendada Villa Owner",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 3,
    text: "We hired Hayagriva as a full interior construction contractor for our 3BHK near NAD Junction. They managed structural changes, false ceilings, and interior décor impeccably. Professional coordination and smooth handover. Real contenders for best interior designers.",
    author: "Ramana Bokam",
    role: "NAD Junction Apartment",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 4,
    text: "For our Maddilapalem 2BHK, Hayagriva acted as a full interior construction contractor—electricals, partitions, decorative finishes, everything. They offered end‑to‑end service, and delivered with care. Great choice if you're after the best interior designers.",
    author: "Kiran Gompa",
    role: "Maddilapalem Flat Owner",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: 5,
    text: "As an interior decorator, Hayagriva pulled off a soothing, artistic theme for my Seethammadhara living room — custom wall panels, coordinated soft furnishings, and ambient lighting. Definitely among the top interior designers in Visakhapatnam.",
    author: "Guna",
    role: "Seethammadhara Villa",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  }
]

export default function HomeTestimonials() {
  const [i, setI] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 9000)
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
    <div className="relative w-full max-w-4xl mx-auto py-6">
      {/* Testimonial Container (Premium Light Glassmorphism Card) */}
      <div className="relative overflow-hidden bg-white border border-gold/20 shadow-xl rounded-3xl p-8 sm:p-14 min-h-[340px] sm:min-h-[280px] flex flex-col justify-between">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Quote & Stars */}
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="text-gold/25">
            <Quote size={48} fill="currentColor" />
          </div>
          <div className="flex gap-1 text-gold">
            {[...Array(testimonials[i].rating)].map((_, idx) => (
              <Star key={idx} size={16} fill="currentColor" className="stroke-gold" />
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
              className="text-base sm:text-lg italic text-charcoal font-serif leading-relaxed"
            >
              "{testimonials[i].text}"
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Author Details & Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-8 pt-6 border-t border-charcoal/10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/40 shrink-0 bg-gold/10">
              <Image 
                src={testimonials[i].image}
                alt={testimonials[i].author}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <div className="font-bold text-charcoal font-serif text-base tracking-wide">{testimonials[i].author}</div>
              <div className="text-[10px] text-gold-dark uppercase tracking-widest font-bold mt-0.5">{testimonials[i].role}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-charcoal/15 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300 text-charcoal bg-warmcream/50 hover:bg-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-charcoal/15 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300 text-charcoal bg-warmcream/50 hover:bg-white"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
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
              idx === i ? 'w-8 bg-gold' : 'w-2.5 bg-charcoal/15 hover:bg-charcoal/30'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
