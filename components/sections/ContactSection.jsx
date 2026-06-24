'use client'

import ContactForm from '../ContactForm'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

// Contact page split layout: dark info card + light form card.
// custom_json.contactItems = [{ icon, label, value, href? }]
export default function ContactSection({ section }) {
  return (
    <div className="bg-warmcream text-charcoal min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          {section.subtitle && <span className="text-[10px] font-bold tracking-widest text-gold uppercase">{section.subtitle}</span>}
          <h1 className="text-4xl sm:text-5xl font-serif text-charcoal mt-3 mb-5 font-bold leading-tight">{section.title}</h1>
          {(section.description || section.content) && <p className="text-charcoal/60 text-xs sm:text-sm leading-relaxed">{section.description || section.content}</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-5 bg-charcoal border border-white/5 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-serif text-gold mb-6 tracking-wide">Contact Information</h3>
              <p className="text-xs sm:text-sm text-beige/60 leading-relaxed mb-10">Drop by our studio for a cup of coffee and browse our extensive catalog of material samples, woods, and upholstery fabrics.</p>
              <div className="space-y-7">
                <ContactItem icon={MapPin} label="Our Studio" value="second floor, DR DEEN COMPLEX, 51-15-1/6, opposite to Tech Mahindra, Satyam Junction, KRANTHI NAGAR, Maddilapalem, Visakhapatnam, Andhra Pradesh 530013" />
                <ContactItem icon={Phone} label="Phone Call" value="+91 95731 78887" href="tel:+919573178887" subtext="Mon-Sat, 9:30 AM - 7:00 PM" />
                <ContactItem icon={Mail} label="Email Address" value="interiorsbyhayagriva@gmail.com" href="mailto:interiorsbyhayagriva@gmail.com" />
                <ContactItem icon={Clock} label="Consultation Hours" value="9AM to 7PM" />
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-white/5 relative z-10">
              <a href="https://www.google.com/maps/search/?api=1&query=Hayagriva%20Interiors%2C%20Maddilapalem%2C%20Visakhapatnam" target="_blank" rel="noreferrer" className="block relative w-full h-40 bg-black-luxury/60 border border-white/5 rounded-2xl overflow-hidden shadow-inner" aria-label="Google Maps">
                <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#FAF8F5" strokeOpacity="0.08" strokeWidth="0.8" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#FAF8F5" strokeOpacity="0.08" strokeWidth="0.8" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#FAF8F5" strokeOpacity="0.08" strokeWidth="0.8" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#FAF8F5" strokeOpacity="0.08" strokeWidth="0.8" />
                  <line x1="70" y1="0" x2="70" y2="100" stroke="#FAF8F5" strokeOpacity="0.08" strokeWidth="0.8" />
                  <line x1="0" y1="100" x2="100" y2="0" stroke="#C4A265" strokeOpacity="0.15" strokeWidth="1.2" />
                  <circle cx="65" cy="35" r="4" fill="#C4A265" />
                  <circle cx="65" cy="35" r="9" fill="none" stroke="#C4A265" strokeWidth="0.8" strokeDasharray="2" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="text-[10px] font-bold text-gold tracking-widest uppercase mb-1">Hayagriva location map</div><div className="text-[9px] text-beige/40 uppercase tracking-widest">Click to navigate on Google Maps</div></div></div>
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-7 bg-white border border-charcoal/5 rounded-3xl shadow-xl p-8 sm:p-12 flex flex-col justify-center relative">
            <span className="text-[10px] font-bold text-gold tracking-widest uppercase mb-2">Book Consultation</span>
            <h3 className="text-3xl font-bold font-serif text-charcoal mb-8">Discuss Your Space</h3>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ContactItem({ icon: Icon, label, value, href, subtext }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-gold mt-1 shadow-md"><Icon size={18} className="stroke-gold" /></div>
      <div>
        <h5 className="text-[10px] font-bold uppercase tracking-widest text-beige/40">{label}</h5>
        {href ? <a href={href} className="text-xs sm:text-sm mt-1.5 hover:text-gold transition-colors block font-semibold text-beige">{value}</a> : <p className="text-xs sm:text-sm mt-1.5 leading-relaxed text-beige/85">{value}</p>}
        {subtext && <p className="text-[10px] text-beige/45 mt-1 font-mono">{subtext}</p>}
      </div>
    </div>
  )
}
