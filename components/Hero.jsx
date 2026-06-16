'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowUpRight, Calendar, ArrowDown } from 'lucide-react'

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  
  // Create parallax effect for background components
  const yBg = useTransform(scrollY, [0, 800], [0, 150])
  const opacityBg = useTransform(scrollY, [0, 600], [1, 0.2])
  const scaleImage = useTransform(scrollY, [0, 800], [1, 1.05])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center bg-black-luxury overflow-hidden pt-24"
    >
      {/* Background Graphic Overlay - Large Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-metallic/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold-mute/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Abstract Grid Line Overlays */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10 py-12 lg:py-0">
        
        {/* Text Area (7 cols on lg+) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-8 text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-gold-metallic/15 rounded-full text-gold-metallic text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-gold-metallic animate-pulse" />
            <span>Bespoke Luxury Interiors</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-6xl lg:text-7xl font-serif text-beige-luxury leading-[1.05] tracking-tight font-extrabold"
          >
            Crafting Spaces <br />
            That Mirror <br />
            Your <span className="italic text-gradient-gold font-normal">Soul.</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="text-muted text-sm sm:text-base max-w-lg leading-relaxed text-beige-luxury/70"
          >
            At Hayagriva, we elevate interior design to architectural storytelling. Every residence, workspace, and kitchen is custom-tailored with premium woods, precision CNC joinery, and tailored styling details.
          </motion.p>
          
          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link 
              href="/portfolio" 
              className="px-8 py-4 bg-gold-metallic hover:bg-white text-black-luxury hover:text-black-luxury text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2.5 group shadow-lg shadow-gold-metallic/20"
            >
              <span>Explore Portfolio</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              href="/contact" 
              className="px-8 py-4 border border-white/10 hover:border-gold-metallic text-beige-luxury hover:text-gold-metallic text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2.5"
            >
              <Calendar size={16} />
              <span>Book Design Session</span>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Cinematic Framed Image (5 cols on lg+) */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          style={{ y: yBg, opacity: opacityBg }}
          className="lg:col-span-5 relative w-full h-[350px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
        >
          {/* Framed Canvas Box */}
          <div className="absolute inset-0 rounded-[40px] overflow-hidden border-8 border-charcoal-luxury/80 shadow-2xl bg-charcoal-luxury/40 group">
            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60 z-10 pointer-events-none" />
            
            <motion.div style={{ scale: scaleImage }} className="w-full h-full relative">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Living Room by Hayagriva"
                fill
                priority
                className="object-cover hover:scale-110 transition-transform duration-[3s] ease-out"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </motion.div>
          </div>
          
          {/* Floating Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-6 left-6 right-6 sm:left-12 sm:right-12 glass-premium px-6 py-4 rounded-2xl flex items-center justify-between border-luxury-gold shadow-lg z-20"
          >
            <div>
              <div className="text-[10px] text-gold-metallic uppercase tracking-widest font-bold">Featured Space</div>
              <div className="text-xs sm:text-sm font-semibold font-serif text-white mt-0.5">Minimalist Villa, Vizag</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-beige-luxury/50 uppercase tracking-widest">Year</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">2024</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })
        }}
      >
        <span className="text-[9px] uppercase tracking-widest text-beige-luxury/50">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-gold-metallic"
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}
