'use client'
import { useState } from 'react'
import ServiceCard from '../../components/ServiceCard'
import { motion } from 'framer-motion'
import { Calculator, Paintbrush, ShieldCheck, Ruler, Clock, Settings, Sparkles } from 'lucide-react'

export default function Services() {
  const serviceList = [
    {
      title: 'Residential Interiors',
      desc: 'Complete high-end home transformations tailored to your aesthetic, from luxurious master suites to open-concept living zones.',
      icon: Paintbrush
    },
    {
      title: 'Commercial Workspaces',
      desc: 'Productive, inspiring corporate spaces, retail boutiques, and creative studios styled to elevate your brand presence.',
      icon: Ruler
    },
    {
      title: 'Bespoke Modular Kitchens',
      desc: 'Italian-inspired, highly functional modular culinary setups incorporating state-of-the-art storage and premium marble finishes.',
      icon: Settings
    },
    {
      title: 'Turnkey Design & Styling',
      desc: 'Seamless, end-to-end management covering material procurement, bespoke carpentry, lighting curation, and final decor styling.',
      icon: Sparkles
    }
  ]

  // Calculator State
  const [spaceType, setSpaceType] = useState('living')
  const [styleTheme, setStyleTheme] = useState('minimalist')
  const [areaSize, setAreaSize] = useState(1000)

  // Pricing constants (per sq ft rates)
  const baseRates = {
    living: 220,
    bedroom: 180,
    kitchen: 450,
    fullhome: 350,
    office: 280
  }

  const styleMultipliers = {
    minimalist: 1.0,
    japandi: 1.25,
    luxury: 1.6
  }

  // Calculating estimates
  const baseRate = baseRates[spaceType] || 200
  const multiplier = styleMultipliers[styleTheme] || 1.0
  const totalCostMin = Math.round(baseRate * areaSize * multiplier * 0.9)
  const totalCostMax = Math.round(baseRate * areaSize * multiplier * 1.15)

  // Format currency in Indian Rupees style (Lakhs / Crores) or custom currency. Let's do Rupees (INR) or standard formatting:
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num)
  }

  const getMaterialSuggestions = () => {
    if (styleTheme === 'minimalist') return ['White Oak Wood', 'Microcement Floors', 'Matte Lacquered Cabinets', 'Brushed Aluminum']
    if (styleTheme === 'japandi') return ['Natural Rattan', 'Unbleached Linens', 'Light Walnut', 'Travertine Stone', 'Washi Paper']
    return ['Calacatta Marble', 'Brushed Brass/Gold', 'Plush Velvet Fabrics', 'Smoked Mirror Panelings', 'Fluted Plasters']
  }

  const getSuggestedTimeline = () => {
    if (spaceType === 'kitchen') return '4 to 6 Weeks'
    if (spaceType === 'bedroom' || spaceType === 'living') return '6 to 8 Weeks'
    if (spaceType === 'office') return '8 to 12 Weeks'
    return '12 to 16 Weeks'
  }

  return (
    <div className="py-24 bg-warmcream min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Services We Offer</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-charcoal mt-2 mb-4">Crafting Luxury Spaces</h1>
          <p className="text-muted text-sm sm:text-base">
            From design blueprints to final styling accessories, we handle everything. Discover our range of specialized design services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {serviceList.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-5"
              >
                <div className="p-3.5 bg-gold/10 text-gold rounded-xl shrink-0">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-charcoal font-serif mb-2">{service.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Interactive Estimator Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Inputs Column */}
          <div className="p-8 sm:p-12 lg:col-span-7 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-gold font-semibold text-xs tracking-wider uppercase mb-3">
                <Calculator size={16} />
                <span>Estimate Your Space Budget</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-charcoal mb-8">Design Budget Planner</h2>

              {/* 1. Choose Space Type */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-3">
                  1. Select Space Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'living', label: 'Living Room' },
                    { id: 'bedroom', label: 'Bedroom' },
                    { id: 'kitchen', label: 'Kitchen' },
                    { id: 'office', label: 'Office Space' },
                    { id: 'fullhome', label: 'Complete Home' }
                  ].map(space => (
                    <button
                      key={space.id}
                      onClick={() => setSpaceType(space.id)}
                      className={`py-3 px-4 text-xs font-medium rounded-xl border text-center transition-all ${
                        spaceType === space.id
                          ? 'bg-charcoal border-charcoal text-white font-semibold'
                          : 'bg-warmcream/30 border-gray-200 text-charcoal hover:border-gold'
                      }`}
                    >
                      {space.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Style Theme */}
              <div className="mb-8">
                <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-3">
                  2. Select Design Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'minimalist', label: 'Modern Minimalist', desc: 'Sleek, clean, organic' },
                    { id: 'japandi', label: 'Warm Japandi', desc: 'Earthy tone, natural woods' },
                    { id: 'luxury', label: 'Classical Luxury', desc: 'Bold stones, gold accents' }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setStyleTheme(theme.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        styleTheme === theme.id
                          ? 'bg-gold/10 border-gold text-charcoal font-semibold shadow-sm'
                          : 'bg-warmcream/30 border-gray-200 text-charcoal hover:border-gold'
                      }`}
                    >
                      <span className="text-xs font-bold">{theme.label}</span>
                      <span className={`text-[10px] block mt-1 ${styleTheme === theme.id ? 'text-gold' : 'text-muted'}`}>{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Area Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">
                    3. Carpet Area
                  </label>
                  <span className="text-sm font-bold text-gold bg-gold/15 px-3 py-1 rounded-full">
                    {areaSize} Sq Ft
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={areaSize}
                  onChange={(e) => setAreaSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-[10px] text-muted mt-2">
                  <span>200 sq ft</span>
                  <span>2,500 sq ft</span>
                  <span>5,000 sq ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outputs Column */}
          <div className="p-8 sm:p-12 lg:col-span-5 bg-charcoal text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold block mb-2">Estimated Investment</span>
              <div className="text-3xl sm:text-4xl font-serif text-gold font-bold mb-2">
                {formatCurrency(totalCostMin)} - {formatCurrency(totalCostMax)}
              </div>
              <p className="text-xs text-gray-400">
                *Approximate cost including materials, design engineering fees, and installation labor.
              </p>

              {/* Suggestions Panel */}
              <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-gold mt-0.5">
                    <Clock size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Estimated Duration</div>
                    <div className="text-sm font-semibold">{getSuggestedTimeline()}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-gold mt-0.5">
                    <Paintbrush size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Recommended Materials</div>
                    <div className="text-sm font-semibold flex flex-wrap gap-1 mt-1">
                      {getMaterialSuggestions().map(mat => (
                        <span key={mat} className="text-[10px] bg-white/10 text-gray-200 px-2.5 py-1 rounded-full">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-lg text-gold mt-0.5">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-400">Warranty Protection</div>
                    <div className="text-sm font-semibold">5-Year Structural Integrity Warranty</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                href={`/contact?space=${spaceType}&style=${styleTheme}&area=${areaSize}`}
                className="w-full text-center block py-4 bg-gold text-white rounded-xl font-semibold hover:bg-white hover:text-charcoal transition-all duration-300 text-sm shadow-lg shadow-gold/20"
              >
                Inquire With This Plan
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
