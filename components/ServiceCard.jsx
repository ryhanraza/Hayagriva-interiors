'use client'
import { motion } from 'framer-motion'
import { Home, Briefcase, Settings, Paintbrush } from 'lucide-react'

export default function ServiceCard({ title, desc }) {
  // Select icon dynamically
  const getIcon = () => {
    const t = title.toLowerCase()
    if (t.includes('residential')) return <Home size={22} />
    if (t.includes('commercial') || t.includes('workspace')) return <Briefcase size={22} />
    if (t.includes('kitchen')) return <Settings size={22} />
    return <Paintbrush size={22} />
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-8 sm:p-10 bg-charcoal-luxury/60 border border-white/5 rounded-2xl shadow-lg hover:shadow-gold-metallic/5 hover:border-gold-metallic/20 transition-all duration-500 overflow-hidden"
    >
      {/* Subtle Radial Glow on Hover */}
      <div className="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Decorative Gold Top Highlight */}
      <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-gold-metallic to-gold-mute transition-all duration-500" />
      
      {/* Icon Wrapper */}
      <div className="w-14 h-14 bg-white/5 text-gold-metallic border border-white/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gold-metallic group-hover:text-black-luxury group-hover:border-gold-metallic transition-all duration-500 shadow-md">
        {getIcon()}
      </div>

      <h4 className="text-xl font-semibold text-beige-luxury mb-3 font-serif group-hover:text-gold-metallic transition-colors duration-300">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-beige-luxury/60 leading-relaxed group-hover:text-beige-luxury/80 transition-colors duration-300">
        {desc}
      </p>
    </motion.div>
  )
}
