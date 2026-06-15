'use client'
import ContactForm from '../../components/ContactForm'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Instagram, Send } from 'lucide-react'

export default function Contact() {
  return (
    <div className="py-24 bg-warmcream min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-charcoal mt-2 mb-4">Start Your Design Journey</h1>
          <p className="text-muted text-sm sm:text-base">
            Book a complimentary design consultation at our studio or schedule a video call with our lead designers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Info Card Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-charcoal text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className="text-2xl font-serif text-gold mb-6">Contact Information</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                Drop by our studio for a cup of coffee and browse our extensive catalog of material samples, woods, and upholstery fabrics.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gold mt-1">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Our Studio</h5>
                    <p className="text-sm mt-1">second floor, DR DEEN COMPLEX, 51-15-1/6, opposite to Tech Mahindra, Satyam Junction, KRANTHI NAGAR, Maddilapalem, Visakhapatnam, Andhra Pradesh 530013</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gold mt-1">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Call</h5>
                    <p className="text-sm mt-1">+91 95731 78887</p>
                    <p className="text-xs text-gray-500 mt-0.5">Mon-Sat, 9:30 AM - 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gold mt-1">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</h5>
                    <a href="mailto:interiorsbyhayagriva@gmail.com" className="text-sm mt-1 hover:text-gold transition-colors block">interiorsbyhayagriva@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-gold mt-1">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400">Consultation Hours</h5>
                    <p className="text-sm mt-1">By appointment only on Sundays.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Stylized Vector Map representation */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="relative w-full h-36 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
                {/* Custom SVG styling that represents a clean abstract street grid */}
                <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#FAF8F5" strokeWidth="0.8" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#FAF8F5" strokeWidth="0.8" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#FAF8F5" strokeWidth="0.8" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="#FAF8F5" strokeWidth="0.8" />
                  <line x1="70" y1="0" x2="70" y2="100" stroke="#FAF8F5" strokeWidth="0.8" />
                  {/* Diagonal boulevard */}
                  <line x1="0" y1="100" x2="100" y2="0" stroke="#FAF8F5" strokeWidth="1.5" />
                  {/* Highlight Pin circle */}
                  <circle cx="65" cy="35" r="5" fill="#C4A265" />
                  <circle cx="65" cy="35" r="10" fill="none" stroke="#C4A265" strokeWidth="1" strokeDasharray="2" />
                </svg>
                <div className="relative z-10 text-center">
                  <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-1">Hayagriva interiors Location</div>
                  <div className="text-[10px] text-gray-400">Clicking map opens directions in Google Maps</div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=second%20floor%2C%20DR%20DEEN%20COMPLEX%2C%2051-15-1%2F6%2C%20opposite%20to%20Tech%20Mahindra%2C%20Satyam%20Junction%2C%20KRANTHI%20NAGAR%2C%20Maddilapalem%2C%20Visakhapatnam%2C%20Andhra%20Pradesh%20530013"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 z-20 cursor-pointer"
                  aria-label="Google Maps"
                />
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 flex flex-col justify-center"
          >
            <span className="text-xs font-semibold text-gold tracking-wider uppercase mb-1">Book Consultation</span>
            <h3 className="text-3xl font-serif text-charcoal mb-8">Discuss Your Space</h3>
            <ContactForm />
          </motion.div>

        </div>

      </div>
    </div>
  )
}
