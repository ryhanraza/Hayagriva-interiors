'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  Shield, 
  Award, 
  ChevronRight, 
  ArrowRight, 
  Utensils, 
  Bed, 
  Sofa, 
  Phone, 
  User, 
  Sparkles, 
  ArrowUpRight,
  BookOpen,
  Wrench,
  Truck,
  Heart,
  ClipboardList,
  PencilRuler,
  Palette,
  Hammer,
  KeyRound,
  Clock,
  ShieldCheck,
  Users,
  Headphones,
  ChevronRight as ChevronRightSmall
} from 'lucide-react'

// Import custom components
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import HomeTestimonials from '../components/HomeTestimonials'

// Animated count-up component: animates from 0 to `target` when scrolled into view
function CountUp({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { duration, ease: [0.16, 1, 0.3, 1] })
      return controls.stop
    }
  }, [inView, target, duration, count])

  return (
    <span ref={ref} className="inline-flex">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default function Home() {
  // Hero lead form states
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle lead form submission
  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: '', // Backend handles optional fields
          message: ''
        })
      })
      if (res.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', phone: '' })
      } else {
        alert('There was an issue submitting your request. Please try again.')
      }
    } catch (err) {
      console.error('Lead submission error', err)
      alert('Network error. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Stats data for Trust Indicators
  const stats = [
    { value: 500, suffix: '+', label: 'Homes Delivered', subtext: 'Exquisite designs across AP', icon: CheckCircle2 },
    { value: 5, suffix: '+ Years', label: 'Experience', subtext: 'Refined craftsmanship', icon: Shield },
    { value: 100, suffix: '%', label: 'Client Satisfaction', subtext: 'Discerning reviews', icon: Heart }
  ]

  // Services data
  const services = [
    {
      title: 'Modular Kitchen',
      desc: 'Sleek, ergonomic layouts featuring premium soft-close cabinets, white oak paneling, and marble surfaces.',
      icon: Utensils,
      color: 'bg-gold-light/40',
      href: '/services/modular-kitchen'
    },
    {
      title: 'Bedroom Interiors',
      desc: 'Timeless master suites designed for peace. Custom headboards, walk-in closets, and ambient bedside lighting.',
      icon: Bed,
      color: 'bg-gold-light/40',
      href: '/services/bedroom'
    },
    {
      title: 'Living Room Design',
      desc: 'Elegant lounges blending Scandinavian simplicity and luxury. Floating media consoles and bespoke plaster walls.',
      icon: Sofa,
      color: 'bg-gold-light/40',
      href: '/services/living-room'
    },
    {
      title: 'Space Planning & 3D Design',
      desc: 'Professional space planning with photorealistic 3D renders to visualize your home before a single material is ordered.',
      icon: PencilRuler,
      color: 'bg-gold-light/40',
      href: '/services/space-planning'
    },
    {
      title: 'Turnkey Interiors',
      desc: 'Complete interior solutions from design to execution.',
      icon: KeyRound,
      color: 'bg-gold-light/40',
      href: '/services/turnkey-solutions'
    }
  ]

  // How It Works Steps
  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      desc: 'We understand your needs, space, and budget to craft a clear vision for your project.',
      icon: ClipboardList
    },
    {
      step: '02',
      title: 'Design & Planning',
      desc: 'We create detailed layouts, 3D designs, and execution-ready plans tailored to you.',
      icon: PencilRuler
    },
    {
      step: '03',
      title: 'Material Selection',
      desc: 'Choose premium finishes, colors, and materials that match your aesthetic perfectly.',
      icon: Palette
    },
    {
      step: '04',
      title: 'Execution',
      desc: 'Our skilled craftsmen bring the design to life with precision and supervision.',
      icon: Hammer
    },
    {
      step: '05',
      title: 'Handover',
      desc: 'Final delivery with rigorous quality assurance and a flawless, ready-to-live space.',
      icon: KeyRound
    }
  ]

  // Highlight Features
  const highlights = [
    { title: 'On-Time Delivery', desc: 'Projects delivered as promised', icon: Clock },
    { title: 'Quality Assurance', desc: 'Rigorous checks at every stage', icon: ShieldCheck },
    { title: 'Expert Team', desc: 'Skilled designers & craftsmen', icon: Users },
    { title: 'End-to-End Support', desc: 'With you from concept to handover', icon: Headphones }
  ]

  // Room-wise Designs
  const roomDesigns = [
    {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
      filter: 'Kitchens',
      tag: 'Culinary Hubs'
    },
    {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
      filter: 'Residential',
      tag: 'Serene Sanctuary'
    },
    {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
      filter: 'Residential',
      tag: 'Grand Lounge'
    }
  ]

  // Featured Projects
  const featuredProjects = [
    {
      title: 'Modern Wood Kitchen & Island',
      type: 'Modular Kitchen',
      budget: '₹8.5 Lakhs',
      image: '/images/project-1.jpg',
      category: 'Kitchens'
    },
    {
      title: 'Bespoke Master Wardrobe',
      type: 'Residential Fitout',
      budget: '₹12 Lakhs',
      image: '/images/project-2.jpg',
      category: 'Residential'
    },
    {
      title: 'Japandi Living Lounge',
      type: 'Full Residence',
      budget: '₹22 Lakhs',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop',
      category: 'Residential'
    }
  ]

  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION (Full Screen) */}
      <section className="relative min-h-screen flex items-center justify-center bg-charcoal text-white overflow-hidden pt-32 pb-20 px-6">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1800&auto=format&fit=crop" 
            alt="Luxury Interior Background" 
            fill
            priority
            className="object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-gold text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span>Luxury Turnkey Interiors</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight font-extrabold text-white"
            >
              Transform Your <br />
              Home into a <br />
              <span className="text-gradient-gold italic font-normal">Dream Space.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-beige/70 text-sm sm:text-base max-w-lg leading-relaxed"
            >
              Bespoke layouts, premium materials, and flawless execution. We translate your story into tailored residential sanctuaries.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-consultation'))}
                className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20"
              >
                Book Free Consultation
              </button>
              <Link 
                href="/portfolio" 
                className="px-8 py-4 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
              >
                <span>View Portfolio</span>
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right Lead Form Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">Get Design Estimates</h3>
              <p className="text-xs text-beige/60">Share your details and receive a customized layout sketch.</p>
            </div>

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 text-gold border border-gold/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="font-serif text-white text-base font-bold">Request Received!</h4>
                <p className="text-xs text-beige/70 leading-relaxed max-w-[240px] mx-auto">
                  Thank you! Our lead coordinator will call you back within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/25 text-white placeholder-white/30 text-xs transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/25 text-white placeholder-white/30 text-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold hover:bg-white text-charcoal font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Get Free Quote</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
            <div className="text-[10px] text-center text-beige/45 font-mono">
              ⚡ Over 500+ consultations booked this month
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST INDICATORS (Row under Hero) */}
      <section className="py-12 bg-white border-b border-charcoal/5 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 px-4 py-3 border-r border-charcoal/5 last:border-none"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12 + 0.2, type: 'spring', stiffness: 200 }}
                  className="w-12 h-12 rounded-2xl bg-gold-light/40 border border-gold/15 text-gold flex items-center justify-center shrink-0"
                >
                  <Icon size={20} className="stroke-gold-dark" />
                </motion.div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal tracking-tight leading-none">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-bold text-charcoal/80 uppercase tracking-widest mt-1">{stat.label}</div>
                  <div className="text-[10px] text-charcoal/50 font-medium mt-0.5">{stat.subtext}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* 3. SERVICES PREVIEW (Grid) */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="max-w-xl space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Expert Design Studios</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">Services We Specialize In</h2>
          </div>
          <Link 
            href="/services" 
            className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors flex items-center gap-2 group shrink-0"
          >
            <span>View All Services</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative block h-[300px] cursor-pointer"
              >
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative p-8 bg-white border border-gold/15 rounded-2xl shadow-sm hover:shadow-lg hover:border-gold transition-all duration-500 overflow-hidden flex flex-col justify-between h-full"
                >
                  {/* Decorative border highlight */}
                  <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[3px] bg-gold transition-all duration-500" />

                  <div>
                    <div className={`w-12 h-12 ${item.color} text-gold border border-gold/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm`}>
                      <Icon size={20} />
                    </div>
                    <h4 className="text-xl font-bold text-charcoal font-serif group-hover:text-gold-dark transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed mt-3 group-hover:text-charcoal/80 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore Design</span>
                    <ArrowRight size={10} />
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. "HOW IT WORKS" SECTION */}
      <section className="py-28 bg-white border-y border-charcoal/5 relative overflow-hidden">
        {/* Soft ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-24 space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">The Turnkey Workflow</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">Our Seamless Design Process</h2>
            <p className="text-charcoal/60 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              A refined, transparent journey from the first conversation to the final handover — crafted with care at every step.
            </p>
          </div>

          {/* Step Timeline */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-4 relative z-10">
              {processSteps.map((item, idx) => {
                const Icon = item.icon
                const isLast = idx === processSteps.length - 1
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center text-center group"
                  >
                    {/* Circular icon */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-warmcream border border-gold/20 flex items-center justify-center text-gold shadow-sm group-hover:shadow-[0_12px_40px_-8px_rgba(197,162,83,0.45)] group-hover:-translate-y-2 group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                        <Icon size={26} strokeWidth={1.6} />
                      </div>
                      {/* Gold step badge */}
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-charcoal text-gold rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-gold/40 shadow-md">
                        {item.step}
                      </span>
                      {/* Arrow indicator (desktop, except last) */}
                      {!isLast && (
                        <div className="hidden lg:flex absolute top-1/2 -right-[calc(50%+8px)] -translate-y-1/2 text-gold/40 z-20">
                          <ChevronRightSmall size={18} />
                        </div>
                      )}
                    </div>

                    {/* Title + description card */}
                    <div className="px-2">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-charcoal mb-2 group-hover:text-gold-dark transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-charcoal/55 leading-relaxed max-w-[200px]">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Highlight Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-28 pt-16 border-t border-charcoal/5"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {highlights.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-2xl bg-warmcream border border-gold/15 hover:border-gold/40 hover:shadow-[0_12px_40px_-12px_rgba(197,162,83,0.4)] transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-gold/20 text-gold flex items-center justify-center shrink-0 shadow-sm group-hover:bg-gold group-hover:text-white transition-all duration-300">
                      <Icon size={20} strokeWidth={1.7} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h5 className="text-sm font-bold text-charcoal font-serif">{item.title}</h5>
                      <p className="text-[11px] text-charcoal/50 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. BEFORE / AFTER SLIDER */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Visual Transformation</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">Witness the Difference</h2>
          <p className="text-charcoal/60 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Drag the center slider handle left or right to compare a raw site measurement shell with our finalized bespoke interior.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-xl"
        >
          <BeforeAfterSlider 
            beforeImage="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop"
            afterImage="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop"
            beforeLabel="Before: Empty space shell"
            afterLabel="After: Luxury Bed Chamber"
          />
        </motion.div>
      </section>

      {/* 6. ROOM-WISE DESIGNS SECTION */}
      <section className="py-28 bg-white border-y border-charcoal/5 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Aesthetics by Room</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">Room-wise Inspirations</h2>
            <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">
              Explore custom catalogs designed specifically for each room environment. Select a room below to filter our selected creations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomDesigns.map((room, idx) => (
              <Link 
                key={room.name}
                href={`/portfolio?filter=${room.filter}`}
                className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-8 border border-charcoal/5 hover:border-gold/30 hover:shadow-xl transition-all duration-500"
              >
                {/* Background image */}
                <Image 
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Overlay card details */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10" />
                
                <div className="relative z-20 space-y-2">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest bg-gold-light/10 border border-gold/20 px-2.5 py-1 rounded-full inline-block backdrop-blur-md">
                    {room.tag}
                  </span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xl font-serif text-white font-bold">{room.name}</h4>
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-gold text-white group-hover:text-charcoal flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-gold">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-28 px-6 bg-warmcream">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Google Reviews</span>
            <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">What Our Clients Say</h2>
          </div>
          
          <HomeTestimonials />
        </div>
      </section>

      {/* 8. FEATURED PROJECTS */}
      <section className="py-28 bg-white border-y border-charcoal/5 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-xl space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Portfolio Highlights</span>
              <h2 className="text-3xl sm:text-5xl font-serif text-charcoal font-bold leading-tight">Selected Creations</h2>
            </div>
            <Link 
              href="/portfolio" 
              className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-dark transition-colors flex items-center gap-2 group shrink-0"
            >
              <span>View Full Portfolio</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((p, idx) => (
              <Link
                key={p.title}
                href={`/portfolio?filter=${p.category}`}
                className="group flex flex-col justify-between bg-warmcream rounded-2xl overflow-hidden border border-charcoal/5 hover:border-gold/30 hover:shadow-lg transition-all duration-500 h-[480px]"
              >
                <div className="relative h-64 w-full overflow-hidden bg-softgrey/10 shrink-0">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-[1.8s] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-charcoal/80 backdrop-blur-md text-gold px-3 py-1.5 rounded-full border border-white/5">
                      {p.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold font-serif text-charcoal group-hover:text-gold-dark transition-colors duration-300">
                      {p.title}
                    </h4>
                    <p className="text-xs text-charcoal/50 leading-relaxed font-semibold">
                      Fine timber panels, bespoke configurations, custom layout styling.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-charcoal/5 flex justify-between items-center mt-4">
                    <div>
                      <div className="text-[9px] text-charcoal/40 uppercase tracking-widest">Est. Budget</div>
                      <div className="text-sm font-bold text-gold-dark mt-0.5">{p.budget}</div>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-charcoal group-hover:text-gold flex items-center gap-1.5 transition-colors">
                      <span>Case Details</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section id="consultation" className="py-24 px-6 bg-charcoal text-white relative overflow-hidden">
        {/* Decorative gold backdrop highlights */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <span className="text-[10px] font-bold tracking-widest text-gold uppercase block">Design Consultation</span>
          <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight font-extrabold">Ready to Transform Your Space?</h3>
          <p className="max-w-xl mx-auto text-beige/60 text-xs sm:text-sm leading-relaxed">
            Schedule a complimentary design session with our lead architects. We will prepare space blueprints, select material samples, and provide immediate project estimates.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold transition-all duration-500 text-xs uppercase tracking-widest shadow-lg shadow-gold/20 rounded-full"
            >
              Get Free Quote
            </Link>
            <a
              href="#consultation"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setTimeout(() => {
                  const formInput = document.querySelector('input')
                  if (formInput) formInput.focus()
                }, 700)
              }}
              className="px-8 py-4 border border-white/10 hover:border-gold text-white hover:text-gold font-bold transition-all duration-500 text-xs uppercase tracking-widest rounded-full cursor-pointer"
            >
              Consult an Architect
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
