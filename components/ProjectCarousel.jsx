'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

/**
 * ProjectCarousel
 *
 * Reusable image carousel for project galleries.
 *
 * @param {string|string[]} images   - A single image URL or an array of URLs.
 * @param {string}  [alt]            - Base alt text applied to each slide.
 * @param {string}  [className]      - Extra classes for the wrapper.
 *
 * @example
 * <ProjectCarousel images={project.images} alt={project.title} />
 */
function normalizeImages(images) {
  if (!images) return []
  if (typeof images === 'string') return [images]
  if (Array.isArray(images)) {
    return images
      .map((img) => (typeof img === 'string' ? img : img?.url))
      .filter(Boolean)
  }
  return []
}

export default function ProjectCarousel({ images, alt = 'Project image', className = '' }) {
  const list = normalizeImages(images)

  if (list.length === 0) {
    return (
      <div className="w-full h-full rounded-2xl bg-charcoal-luxury/60 flex items-center justify-center text-gold-mute">
        No images available
      </div>
    )
  }

  return (
    <div className={`project-carousel relative w-full h-full ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        navigation
        pagination={{ clickable: true }}
        loop={list.length > 1}
        grabCursor
        className="!w-full !h-full !rounded-none overflow-visible"
      >
        {list.map((src, index) => (
          <SwiperSlide key={index} className="!h-full">
            <img
              src={src}
              alt={`${alt} ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Keep Swiper controls above sibling overlays */}
      <style jsx global>{`
        /* Make the Swiper fill its parent container */
        .project-carousel .swiper,
        .project-carousel .swiper-wrapper,
        .project-carousel .swiper-slide {
          width: 100%;
          height: 100%;
        }

        /* --- Navigation arrows --- */
        .project-carousel .swiper-button-next,
        .project-carousel .swiper-button-prev {
          z-index: 30;              /* above overlays */
          width: 44px;
          height: 44px;
          margin-top: -22px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          color: #d4af37;            /* gold-metallic */
          transition: background 0.3s ease, color 0.3s ease, opacity 0.3s ease;
        }
        .project-carousel .swiper-button-next::after,
        .project-carousel .swiper-button-prev::after {
          font-size: 18px;
          font-weight: 700;
        }
        .project-carousel .swiper-button-next:hover,
        .project-carousel .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.7);
          color: #f5e6c8;            /* beige-luxury */
        }

        /* Hide arrows on touch / small screens */
        @media (max-width: 768px) {
          .project-carousel .swiper-button-next,
          .project-carousel .swiper-button-prev {
            display: none !important;
          }
        }

        /* --- Pagination dots --- */
        .project-carousel .swiper-horizontal > .swiper-pagination-bullets,
        .project-carousel .swiper-pagination-fraction,
        .project-carousel .swiper-pagination-custom,
        .project-carousel .swiper-pagination {
          z-index: 30;              /* above overlays */
          bottom: 14px !important;
        }
        .project-carousel .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #ffffff;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .project-carousel .swiper-pagination-bullet-active {
          background: #d4af37;      /* gold-metallic */
          opacity: 1;
          width: 24px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  )
}
