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

  return (
    <div className="w-full">
      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gold/5 border border-gold/25 rounded-2xl flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h4 className="text-xl font-semibold font-serif text-charcoal mb-2">Consultation Booking Received</h4>
          <p className="text-sm text-muted max-w-sm mb-6">
            Thank you, {formData.name}. Our studio manager will call you within 24 hours to schedule your session.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-gold bg-gold/10 px-4 py-2 rounded-full">
            <CalendarDays size={14} />
            <span>Expect call: Mon-Sat, 9 AM - 6 PM</span>
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
                className="w-full px-4 py-3.5 bg-warmcream/30 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-gray-400 text-sm transition-all"
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
                className="w-full px-4 py-3.5 bg-warmcream/30 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-gray-400 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (e.g. +91 99999 88888)"
              className="w-full px-4 py-3.5 bg-warmcream/30 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-gray-400 text-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your space (e.g. 3BHK flat, Modular Kitchen, commercial lobby...)"
              className="w-full px-4 py-3.5 bg-warmcream/30 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-gray-400 text-sm transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-charcoal text-white rounded-xl font-semibold hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
                <span>Book Free Design Session</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
