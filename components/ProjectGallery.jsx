'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, Keyboard, FreeMode, A11y } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize2, X, MapPin } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

/**
 * Normalize any image shape we receive into a flat list of slide objects.
 * Accepts:
 *   - string urls
 *   - { url } | { image_url } | { src } objects
 * De-dupes by URL so the cover image is never shown twice.
 */
function normalizeImages(images, fallbackAlt = 'Project image') {
  if (!images) return []
  const arr = Array.isArray(images) ? images : [images]

  const seen = new Set()
  const out = []
  arr.forEach((raw, index) => {
    if (!raw) return
    const url =
      typeof raw === 'string'
        ? raw
        : raw.url || raw.image_url || raw.src || raw.image
    if (!url || typeof url !== 'string' || !url.trim()) return
    if (seen.has(url)) return
    seen.add(url)
    out.push({
      id: raw.id ?? url,
      url,
      alt: raw.alt || raw.caption || `${fallbackAlt} ${index + 1}`
    })
  })
  return out
}

/**
 * ProjectGallery
 *
 * Premium, luxury-style image gallery for a Project Details page.
 *
 * Layout:
 *   - Large featured image slider (left, fills the showcase card)
 *     · prev / next arrows
 *     · smooth slide animation
 *     · swipe (mobile) + mouse drag (desktop)
 *     · keyboard ← / → navigation
 *     · image counter (e.g. 2/8)
 *     · optional fullscreen viewer
 *   - Horizontal thumbnail strip below the main image
 *     · click to jump
 *     · active thumbnail highlighted
 *     · scrolls horizontally when overflowing
 *
 * Single image  → static image, no controls.
 * Many images   → full carousel.
 *
 * @param {Array|string} images   - Cover image + gallery images.
 * @param {string}       [title]  - Used for alt text + lightbox caption.
 * @param {string}       [category]
 * @param {string}       [location]
 * @param {string}       [className]
 */
export default function ProjectGallery({
  images,
  title = 'Project',
  category,
  location,
  className = ''
}) {
  const slides = normalizeImages(images, title)
  const [activeIndex, setActiveIndex] = useState(0)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const mainPrevRef = useRef(null)
  const mainNextRef = useRef(null)
  const lightboxPrevRef = useRef(null)
  const lightboxNextRef = useRef(null)

  const isMultiple = slides.length > 1

  // ---- Lightbox keyboard handling (Esc / arrows) ----
  const onLightboxKey = useCallback(
    (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    },
    []
  )
  useEffect(() => {
    if (!lightboxOpen) return
    window.addEventListener('keydown', onLightboxKey)
    return () => window.removeEventListener('keydown', onLightboxKey)
  }, [lightboxOpen, onLightboxKey])

  // ---------- Nothing to show ----------
  if (slides.length === 0) {
    return (
      <div className="relative w-full h-full rounded-[2.2rem] bg-charcoal/5 flex items-center justify-center text-charcoal/30">
        <span className="text-[10px] uppercase tracking-widest font-bold">
          No Image
        </span>
      </div>
    )
  }

  // ---------- Single image (no carousel) ----------
  if (!isMultiple) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <img
          src={slides[0].url}
          alt={slides[0].alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }

  // ---------- Multiple images ----------
  return (
    <div className={`project-gallery relative w-full h-full ${className}`}>
      {/* Main slider */}
      <Swiper
        modules={[Navigation, Thumbs, Keyboard, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        grabCursor
        simulateTouch
        keyboard={{ enabled: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        navigation={{
          prevEl: mainPrevRef.current,
          nextEl: mainNextRef.current
        }}
        onBeforeInit={(swiper) => {
          // Bind custom navigation elements once they exist
          if (swiper.params.navigation) {
            swiper.params.navigation.prevEl = mainPrevRef.current
            swiper.params.navigation.nextEl = mainNextRef.current
          }
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="!w-full !h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="!h-full">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full h-full cursor-zoom-in"
              aria-label="Open fullscreen"
            >
              <img
                src={slide.url}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrows (desktop) */}
      <button
        ref={mainPrevRef}
        type="button"
        aria-label="Previous image"
        className="gallery-arrow gallery-arrow-prev absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-300"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        ref={mainNextRef}
        type="button"
        aria-label="Next image"
        className="gallery-arrow gallery-arrow-next absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 h-10 w-11 sm:h-11 sm:w-11 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-300"
      >
        <ChevronRight size={20} />
      </button>

      {/* Top-right: counter + fullscreen */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-2">
        <span className="backdrop-blur-md bg-black/45 border border-white/15 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider text-white tabular-nums">
          {activeIndex + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open fullscreen gallery"
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-300"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Bottom overlay: category + location (kept from original showcase card) */}
      {(category || location) && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-16 z-20 flex flex-wrap gap-2">
          {category && (
            <span className="backdrop-blur-md bg-white/85 border border-charcoal/5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-wider text-gold-dark font-bold shadow-sm">
              {category}
            </span>
          )}
          {location && (
            <span className="backdrop-blur-md bg-white/85 border border-charcoal/5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-wider text-charcoal font-bold shadow-sm flex items-center gap-1.5">
              <MapPin size={12} className="text-gold" /> {location}
            </span>
          )}
        </div>
      )}

      {/* Thumbnail strip (below the main image) */}
      <div className="gallery-thumbs-wrap mt-3">
        <Swiper
          modules={[Thumbs, FreeMode, A11y]}
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          spaceBetween={8}
          freeMode
          watchSlidesProgress
          threshold={4}
          className="!px-0.5 !py-1"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide
              key={slide.id}
              className="!w-16 !h-16 sm:!w-20 sm:!h-20 shrink-0"
            >
              {({ isActive }) => (
                <div
                  className={`relative w-full h-full rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                    isActive
                      ? 'border-gold ring-2 ring-gold/40 opacity-100'
                      : 'border-charcoal/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={slide.url}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ---------- Fullscreen lightbox ---------- */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            {/* Top bar */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-30 flex items-center justify-between">
              <span className="text-white/80 text-xs font-bold tracking-widest tabular-nums">
                {activeIndex + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lightbox slider */}
            <div className="relative w-full max-w-6xl h-[78vh]">
              <Swiper
                modules={[Navigation, Keyboard, A11y]}
                slidesPerView={1}
                grabCursor
                simulateTouch
                keyboard={{ enabled: true }}
                navigation={{
                  prevEl: lightboxPrevRef.current,
                  nextEl: lightboxNextRef.current
                }}
                onBeforeInit={(swiper) => {
                  if (swiper.params.navigation) {
                    swiper.params.navigation.prevEl = lightboxPrevRef.current
                    swiper.params.navigation.nextEl = lightboxNextRef.current
                  }
                }}
                initialSlide={activeIndex}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="!w-full !h-full"
              >
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id} className="!h-full flex items-center justify-center">
                    <img
                      src={slide.url}
                      alt={slide.alt}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                ref={lightboxPrevRef}
                type="button"
                aria-label="Previous"
                className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                ref={lightboxNextRef}
                type="button"
                aria-label="Next"
                className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Keep Swiper controls invisible — we render our own custom buttons */
        .project-gallery .swiper-button-next,
        .project-gallery .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
