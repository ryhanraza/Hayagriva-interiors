'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle2, CalendarDays, Sparkles } from 'lucide-react'

const AP_CITIES = [
  'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kakinada',
  'Nellore', 'Kurnool', 'Rajahmundry', 'Anantapur', 'Ongole', 'Other'
]

export default function ConsultationModal() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' })

  // Auto-show after 3s — only once per session
  useEffect(() => {
    if (sessionStorage.getItem('consultation_seen')) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('consultation_seen', '1')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Allow any "Book Free Consultation" button to open the modal
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-consultation', handler)
    return () => window.removeEventListener('open-consultation', handler)
  }, [])

  // Lock background scroll + close on Escape while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
      window.addEventListener('keydown', onKey)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', onKey)
      }
    }
  }, [open])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: `Quick Consultation Lead — City: ${formData.city || 'Not specified'}`,
      source: 'website-popup-modal'
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Submission failed')
      setSent(true)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Consultation modal submit error', err)
      alert('There was an error submitting the form. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const close = () => {
    setOpen(false)
    // Reset success view shortly after closing so a reopen starts fresh
    setTimeout(() => setSent(false), 300)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={close}
        >
          {/* Dark blurred overlay */}
          <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-md" />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-charcoal/5 hover:bg-charcoal/10 flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-all duration-300"
            >
              <X size={18} />
            </button>

            {sent ? (
              /* Success state */
              <div className="p-8 sm:p-10 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6 border border-gold/20">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold font-serif text-charcoal mb-3">Request Received!</h4>
                <p className="text-xs sm:text-sm text-charcoal/60 max-w-xs mb-6 leading-relaxed">
                  Thank you, {formData.name}. Our design coordinator will contact you within 24 hours to schedule your free consultation.
                </p>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gold bg-gold/5 px-5 py-2.5 rounded-full border border-gold/10">
                  <CalendarDays size={14} />
                  <span className="text-gold-dark">Studio: Mon–Sat, 9:30 AM – 7:00 PM</span>
                </div>
              </div>
            ) : (
              <>
                {/* Gold accent header */}
                <div className="bg-charcoal px-8 sm:px-10 pt-10 pb-8 text-white relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold mb-3">
                      <Sparkles size={12} className="animate-pulse" />
                      Free Consultation
                    </span>
                    <h3 className="text-2xl sm:text-[1.7rem] font-serif font-bold leading-tight mb-2">
                      Get Free Interior Consultation
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                      Our experts will contact you within 24 hours
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 sm:p-10 pt-7 space-y-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-warmcream border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-charcoal placeholder-softgrey/70 text-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-warmcream border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-charcoal placeholder-softgrey/70 text-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-warmcream border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-charcoal placeholder-softgrey/70 text-sm transition-all"
                    />
                  </div>
                  <div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-warmcream border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select City</option>
                      {AP_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gold hover:bg-charcoal hover:text-white text-charcoal font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Book Free Consultation</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-softgrey/70 pt-1">
                    🔒 Your details are safe with us. No spam, ever.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
