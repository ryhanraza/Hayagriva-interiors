'use client'
import Link from 'next/link'
import { Instagram, Compass, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white border-t border-white/10 pt-16 pb-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
        {/* Branding Column */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="font-serif text-xl tracking-wider font-bold italic uppercase block">
            Hayagriva Interiors<span className="text-gold not-italic">.</span>
          </Link>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
            Bespoke interior design studio crafting timeless residential and commercial spaces. Fusing traditional craftsmanship with contemporary aesthetics.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram size={14} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/15 hover:border-gold hover:text-gold flex items-center justify-center transition-colors" aria-label="Pinterest">
              <Compass size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold">Studio</h4>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
            <li><Link href="/portfolio" className="hover:text-gold transition-colors">Selected Projects</Link></li>
            <li><Link href="/services" className="hover:text-gold transition-colors">Our Services</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">Our Story & Team</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Get A Quote</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold">Say Hello</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
              <span>second floor, DR DEEN COMPLEX, 51-15-1/6, opposite to Tech Mahindra, Satyam Junction, KRANTHI NAGAR, Maddilapalem, Visakhapatnam, Andhra Pradesh 530013</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gold shrink-0" />
              <span>+91 95731 78887</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gold shrink-0" />
              <a href="mailto:interiorsbyhayagriva@gmail.com" className="hover:text-gold transition-colors">interiorsbyhayagriva@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Credits Footer */}
      <div className="max-w-6xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[10px] sm:text-xs text-gray-500">
          © {new Date().getFullYear()} Hayagriva Interiors. All rights reserved.
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 flex gap-4">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
