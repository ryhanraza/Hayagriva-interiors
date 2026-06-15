'use client'
import { motion } from 'framer-motion'
import { Home, Briefcase, Settings, Paintbrush } from 'lucide-react'

export default function ServiceCard({ title, desc }) {
  // Select icon dynamically
  const getIcon = () => {
    const t = title.toLowerCase()
    if (t.includes('residential')) return <Home size={20} />
    if (t.includes('commercial') || t.includes('workspace')) return <Briefcase size={20} />
    if (t.includes('kitchen')) return <Settings size={20} />
    return <Paintbrush size={20} />
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gold/20 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Gold Top Bar */}
      <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[3px] bg-gold transition-all duration-500" />
      
      {/* Icon Wrapper */}
      <div className="w-12 h-12 bg-gold/10 text-gold rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-colors duration-500">
        {getIcon()}
      </div>

      <h4 className="text-lg font-semibold text-charcoal mb-2 font-serif group-hover:text-gold transition-colors duration-300">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-muted leading-relaxed">
        {desc}
      </p>
    </motion.div>
  )
}
