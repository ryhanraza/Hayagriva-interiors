'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { cfg, arr } from './section-utils'

// Trust-indicator stats row with count-up animation.
// custom_json.items = [{ value: 500, suffix: '+', label, subtext, icon }]
// icon names map to lucide icons (limited set used on the home page).
import { CheckCircle2, Shield, Heart, Award, Users, Clock, Star, Home } from 'lucide-react'

const ICONS = { CheckCircle2, Shield, Heart, Award, Users, Clock, Star, Home }

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

export default function StatsSection({ section }) {
  const items = arr(cfg(section, 'items', []))

  return (
    <section className="py-12 bg-white border-b border-charcoal/5 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
        {items.map((stat, idx) => {
          const Icon = ICONS[stat.icon] || CheckCircle2
          return (
            <motion.div
              key={idx}
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
                  <CountUp target={Number(stat.value) || 0} suffix={stat.suffix || ''} />
                </div>
                <div className="text-xs font-bold text-charcoal/80 uppercase tracking-widest mt-1">{stat.label}</div>
                {stat.subtext && <div className="text-[10px] text-charcoal/50 font-medium mt-0.5">{stat.subtext}</div>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
