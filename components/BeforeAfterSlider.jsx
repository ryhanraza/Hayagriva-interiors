'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function BeforeAfterSlider({
  beforeImage = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop",
  afterImage = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
  beforeLabel = "Before (Raw / Renovation)",
  afterLabel = "After (Luxury Design)"
}) {
  const [sliderPosition, setSliderPosition] = useState(50) // Percentage (0-100)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    let percentage = (x / rect.width) * 100
    if (percentage < 0) percentage = 0
    if (percentage > 100) percentage = 100
    setSliderPosition(percentage)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX)
    }
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-charcoal/10 select-none bg-softgrey/10 group cursor-ew-resize"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (Background) */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={beforeImage}
          alt="Before Renovation"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="absolute bottom-6 left-6 bg-charcoal/85 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full z-20 border border-white/5">
          {beforeLabel}
        </div>
      </div>

      {/* After Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image 
          src={afterImage}
          alt="After Renovation"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        <div className="absolute bottom-6 right-6 bg-gold text-charcoal text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full z-20 shadow-lg font-semibold">
          {afterLabel}
        </div>
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-30"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white text-charcoal border-4 border-gold rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-transform duration-200 cursor-grab active:cursor-grabbing">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-dark fill-current" viewBox="0 0 24 24">
            <path d="M8 7l-5 5 5 5V7zm8 0l5 5-5 5V7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
