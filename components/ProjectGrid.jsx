'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, X, Layers, Compass } from 'lucide-react'

export const projects = [
  {
    id: 1,
    title: 'Modern Wood Kitchen & Island',
    category: 'Kitchens',
    location: 'Visakhapatnam, AP',
    year: '2024',
    area: '250 Sq Ft',
    materials: 'White Oak, Granite Countertop, Premium Fixtures',
    desc: 'A seamless transition of warm wood paneling, an elegant breakfast island counter, and premium dark grey modular kitchen cabinets.',
    image: '/images/project-1.jpg'
  },
  {
    id: 2,
    title: 'Bespoke Master Wardrobe',
    category: 'Residential',
    location: 'Visakhapatnam, AP',
    year: '2024',
    area: '420 Sq Ft',
    materials: 'Teak Wood, Matte Laminate, Premium Grooved MDF',
    desc: 'A contemporary master bedroom wardrobe system featuring light grey sliding panels, matching bedside table, and clean minimalist alignments.',
    image: '/images/project-2.jpg'
  },
  {
    id: 3,
    title: 'Sage Custom Console',
    category: 'Residential',
    location: 'Visakhapatnam, AP',
    year: '2023',
    area: '180 Sq Ft',
    materials: 'Sage Lacquered MDF, Polished Brass Handles, Carrara Marble',
    desc: 'A bespoke floor-standing storage console in soft sage green, fitted with modern handles and set against classic white marble flooring.',
    image: '/images/project-3.jpg'
  },
  {
    id: 4,
    title: 'The Oak TV Lounge',
    category: 'Residential',
    location: 'Visakhapatnam, AP',
    year: '2024',
    area: '320 Sq Ft',
    materials: 'White Oak, Floating Veneer Paneling, Spotlighting',
    desc: 'A premium TV unit design featuring a floating charcoal media console, integrated open shelving, and hidden ambient lighting.',
    image: '/images/project-4.jpg'
  },
  {
    id: 5,
    title: 'Calacatta Marble Kitchen',
    category: 'Kitchens',
    location: 'Mumbai, MH',
    year: '2024',
    area: '450 Sq Ft',
    materials: 'Calacatta Marble, Brushed Brass, Matte Charcoal Cabinets',
    desc: 'An exquisite culinary space designed for entertainment. Featuring a book-matched marble kitchen island, smart built-in appliances, and custom luxury lighting.',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'The Obsidian Corporate Suite',
    category: 'Commercial',
    location: 'Chennai, TN',
    year: '2023',
    area: '5,800 Sq Ft',
    materials: 'Acoustic Felt, Anodized Aluminum, Smoked Glass',
    desc: 'A modern co-working and corporate office designed to encourage collaboration. Striking dark accents contrast with lush indoor biophilic integrations.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Japandi Living Lounge',
    category: 'Residential',
    location: 'Pune, MH',
    year: '2023',
    area: '1,800 Sq Ft',
    materials: 'Tatami Mats, Paper Lanterns, Rattan, Walnut',
    desc: 'A cozy living space fusing Japanese simplicity with Scandinavian warmth. Emphasizing clean lines, low-profile furniture, and handcrafted details.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 8,
    title: 'Elysian Dining Lounge',
    category: 'Residential',
    location: 'Delhi, NCR',
    year: '2024',
    area: '2,100 Sq Ft',
    materials: 'Fluted Plaster, Brushed Champagne Gold, Velvet',
    desc: 'A sophisticated dining room styling. Rich velvet seating and customized fluted wall plaster details create an ambient evening dining experience.',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1200&auto=format&fit=crop'
  }
]

export default function ProjectGrid({ limit = 8, filter = 'All' }) {
  const [selectedProject, setSelectedProject] = useState(null)

  const filteredProjects = filter === 'All' 
    ? projects.slice(0, limit)
    : projects.filter(p => p.category === filter).slice(0, limit)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedProject(p)}
          >
            <div className="relative h-64 w-full overflow-hidden bg-gray-50">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-xs font-semibold tracking-widest uppercase bg-gold px-3 py-1.5 rounded-full">
                  Explore Project
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                  {p.category}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-charcoal group-hover:text-gold transition-colors font-serif">
                {p.title}
              </h4>
              <p className="text-sm text-muted mt-2 line-clamp-2">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-warmcream rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Image Column */}
              <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content Column */}
              <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-charcoal mt-4 mb-4">
                    {selectedProject.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    {selectedProject.desc}
                  </p>

                  <div className="border-t border-gray-200/60 pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <div className="text-xs text-muted">Location</div>
                        <div className="text-sm font-semibold text-charcoal">{selectedProject.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Compass size={14} />
                      </div>
                      <div>
                        <div className="text-xs text-muted">Area Size</div>
                        <div className="text-sm font-semibold text-charcoal">{selectedProject.area}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Layers size={14} />
                      </div>
                      <div>
                        <div className="text-xs text-muted">Key Materials</div>
                        <div className="text-sm font-semibold text-charcoal">{selectedProject.materials}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href="/contact"
                    className="flex-1 text-center py-3 bg-charcoal text-white rounded-lg font-semibold hover:bg-gold hover:text-white transition-colors duration-300 text-sm"
                  >
                    Inquire About Similar Design
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
