'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Calendar } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative min-h-[90vh] md:h-[90vh] flex items-center bg-warmcream overflow-hidden py-16 md:py-0">
      {/* Background Graphic Overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-beige opacity-30 pointer-events-none rounded-l-[200px]" />
      
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text Area (7 cols on md+) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-7 space-y-6 text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span>Bespoke Interior Design</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl lg:text-6xl font-serif text-charcoal leading-[1.1] font-bold"
          >
            Designing Spaces <br className="hidden lg:block"/>
            That <span className="italic text-gold font-normal">Inspire</span> Living.
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-muted text-sm sm:text-base max-w-lg leading-relaxed"
          >
            At Hayagriva Interiors, we translate your lifestyle and tastes into luxury spaces. Every corner is meticulously crafted with high-end materials, organic tones, and customized carpentry.
          </motion.p>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link 
              href="/portfolio" 
              className="px-6 py-3.5 bg-charcoal hover:bg-gold text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-charcoal/10"
            >
              <span>Explore Portfolio</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <Link 
              href="/contact" 
              className="px-6 py-3.5 border border-charcoal/20 hover:border-gold hover:text-gold text-charcoal text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center gap-2"
            >
              <Calendar size={14} />
              <span>Book Design Session</span>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating Framed Image (5 cols on md+) */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="md:col-span-5 relative w-full h-[350px] sm:h-[450px] md:h-[500px]"
        >
          {/* Framed Canvas Box */}
          <div className="absolute inset-0 rounded-[30px] overflow-hidden border-8 border-white shadow-2xl bg-gray-50">
            <Image
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
              alt="Luxury Living Room by Hayagriva"
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-[2s] ease-out"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          
          {/* Designer Badge overlay */}
          <div className="absolute -bottom-4 -left-4 glass-premium px-5 py-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-serif text-sm font-semibold">
              H
            </div>
            <div>
              <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Designed By</div>
              <div className="text-xs font-semibold text-charcoal">Asha Rao, Lead Architect</div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}
