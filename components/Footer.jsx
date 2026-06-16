'use client'
import Link from 'next/link'
import { Instagram, Compass, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal-luxury text-beige-luxury border-t border-white/5 pt-20 pb-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        {/* Branding Column */}
        <div className="md:col-span-5 space-y-6">
          <Link href="/" className="font-serif text-2xl tracking-widest font-bold uppercase block text-beige-luxury">
            Hayagriva Interiors<span className="text-gold-metallic">.</span>
          </Link>
          <p className="text-beige-luxury/60 text-xs sm:text-sm leading-relaxed max-w-sm">
            Bespoke interior design studio crafting timeless residential and commercial spaces. Fusing traditional craftsmanship with contemporary aesthetics.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold-metallic hover:text-gold-metallic flex items-center justify-center transition-all duration-300" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold-metallic hover:text-gold-metallic flex items-center justify-center transition-all duration-300" aria-label="Pinterest">
              <Compass size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-metallic">Studio</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-beige-luxury/60">
            <li><Link href="/portfolio" className="hover:text-gold-metallic transition-colors">Selected Creations</Link></li>
            <li><Link href="/services" className="hover:text-gold-metallic transition-colors">Our Services</Link></li>
            <li><Link href="/about" className="hover:text-gold-metallic transition-colors">Our Story & Team</Link></li>
            <li><Link href="/contact" className="hover:text-gold-metallic transition-colors">Get A Quote</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gold-metallic">Say Hello</h4>
          <ul className="space-y-4 text-xs sm:text-sm text-beige-luxury/60">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-gold-metallic shrink-0 mt-0.5" />
              <span className="leading-relaxed">second floor, DR DEEN COMPLEX, 51-15-1/6, opposite to Tech Mahindra, Satyam Junction, KRANTHI NAGAR, Maddilapalem, Visakhapatnam, Andhra Pradesh 530013</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold-metallic shrink-0" />
              <span>+91 95731 78887</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-gold-metallic shrink-0" />
              <a href="mailto:interiorsbyhayagriva@gmail.com" className="hover:text-gold-metallic transition-colors">interiorsbyhayagriva@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Credits Footer */}
      <div className="max-w-6xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[10px] sm:text-xs text-beige-luxury/40">
          © {new Date().getFullYear()} Hayagriva Interiors. All rights reserved.
        </div>
        <div className="text-[10px] sm:text-xs text-beige-luxury/40 flex gap-6">
          <a href="#" className="hover:text-gold-metallic transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold-metallic transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
