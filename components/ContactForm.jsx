'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, CalendarDays } from 'lucide-react'

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Submission failed')
      }

      setSent(true)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Contact submit error', err)
      alert('There was an error submitting the form. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Phone field: digits only
  const handlePhoneChange = (e) => {
    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
  }

  return (
    <div className="w-full">
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center p-10 bg-gold/5 border border-gold/15 rounded-3xl flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6 border border-gold/20">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="text-xl font-bold font-serif text-charcoal mb-3">Consultation Session Booked</h4>
          <p className="text-xs sm:text-sm text-charcoal/60 max-w-sm mb-8 leading-relaxed">
            Thank you, {formData.name}. Our design coordinator will call you within 24 hours to schedule your session.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-gold bg-gold/5 px-5 py-2.5 rounded-full border border-gold/10">
            <CalendarDays size={14} className="stroke-gold" />
            <span className="text-gold-dark">Studio Office: Mon-Sat, 9:30 AM - 7:00 PM</span>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-5 py-4 bg-charcoal/5 border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-charcoal placeholder-charcoal/40 text-sm transition-all"
                required
              />
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-5 py-4 bg-charcoal/5 border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-charcoal placeholder-charcoal/40 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              inputMode="numeric"
              pattern="\d{7,15}"
              placeholder="Phone Number (e.g. +91 95731 78887)"
              className="w-full px-5 py-4 bg-charcoal/5 border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-charcoal placeholder-charcoal/40 text-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your space (e.g., 3BHK Apartment, Modular Kitchen, Office Lobby...)"
              className="w-full px-5 py-4 bg-charcoal/5 border border-charcoal/10 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-charcoal placeholder-charcoal/40 text-sm transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gold hover:bg-charcoal hover:text-white text-charcoal font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-gold/15 flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} />
                <span>Book Free Design Session</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
