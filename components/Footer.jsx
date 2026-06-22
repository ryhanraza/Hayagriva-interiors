'use client'
import Link from 'next/link'
import { Instagram, Youtube, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react'

function WhatsAppIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-theme-black text-theme-offwhite border-t border-white/5 pt-20 pb-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 md:gap-8 mb-16">
        
        {/* Branding Column */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-footer.png"
              alt="Hayagriva Interiors"
              className="h-14 w-auto"
            />
          </Link>
          <p className="text-theme-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest font-serif">
            Your Vision Our Commitment
          </p>
          <p className="text-theme-grey text-xs sm:text-sm leading-relaxed max-w-sm">
            Bespoke interior design studio crafting timeless residential and commercial spaces. Fusing traditional craftsmanship with contemporary aesthetics.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-theme-gold">Quick Links</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-theme-grey">
            <li><Link href="/" className="hover:text-theme-gold transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-theme-gold transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-theme-gold transition-colors">Services</Link></li>
            <li><Link href="/portfolio" className="hover:text-theme-gold transition-colors">Projects</Link></li>
            <li><Link href="/contact" className="hover:text-theme-gold transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Services Column */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-theme-gold">Services</h4>
          <ul className="space-y-3 text-xs sm:text-sm text-theme-grey">
            <li><Link href="/services/modular-kitchen" className="hover:text-theme-gold transition-colors">Modular Kitchen</Link></li>
            <li><Link href="/services/bedroom" className="hover:text-theme-gold transition-colors">Bedroom Interiors</Link></li>
            <li><Link href="/services/living-room" className="hover:text-theme-gold transition-colors">Living Room Design</Link></li>
            <li><Link href="/services/space-planning" className="hover:text-theme-gold transition-colors">Space Planning & 3D Design</Link></li>
            <li><Link href="/services/turnkey-solutions" className="hover:text-theme-gold transition-colors">Turnkey Interiors</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-theme-gold">Contact Us</h4>
          <ul className="space-y-4 text-xs sm:text-sm text-theme-grey">
            <li className="flex items-start gap-3">
              <a href="https://www.google.com/maps/search/Hayagriva+Interiors+DR+DEEN+COMPLEX+Maddilapalem+Visakhapatnam+Andhra+Pradesh+530013" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                <MapPin size={16} className="text-theme-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed text-[11px] sm:text-xs group-hover:text-theme-gold transition-colors">
                  second floor, DR DEEN COMPLEX, 51-15-1/6, opposite to Tech Mahindra, Satyam Junction, KRANTHI NAGAR, Maddilapalem, Visakhapatnam, Andhra Pradesh 530013
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-theme-gold shrink-0" />
              <a href="tel:+919573178887" className="hover:text-theme-gold transition-colors">+91 95731 78887</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-theme-gold shrink-0" />
              <a href="mailto:interiorsbyhayagriva@gmail.com" className="hover:text-theme-gold transition-colors">interiorsbyhayagriva@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Follow Us Column */}
        <div className="md:col-span-1 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-theme-gold">Follow Us</h4>
          <div className="flex flex-col gap-3 pt-1">
            <a href="https://www.instagram.com/hayagriva_interiors?utm_source=qr&igsh=MWxydW0yd3Y4aXAzZQ==" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-theme-gold hover:text-theme-gold flex items-center justify-center transition-all duration-300" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com/share/18cmqePWNS/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-theme-gold hover:text-theme-gold flex items-center justify-center transition-all duration-300" aria-label="Facebook">
              <Facebook size={16} />
            </a>
            <a href="https://youtube.com/@hayagrivainteriors" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-theme-gold hover:text-theme-gold flex items-center justify-center transition-all duration-300" aria-label="YouTube">
              <Youtube size={16} />
            </a>
            <a href="https://wa.me/919573178887" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-theme-gold hover:text-theme-gold flex items-center justify-center transition-all duration-300" aria-label="WhatsApp">
              <WhatsAppIcon size={16} />
            </a>
            <a href="https://www.linkedin.com/company/hayagriva-interiors/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white/5 border border-white/10 hover:border-theme-gold hover:text-theme-gold flex items-center justify-center transition-all duration-300" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

      </div>

      {/* Credits Footer */}
      <div className="max-w-6xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-[10px] sm:text-xs text-theme-grey/50">
          © {new Date().getFullYear()} Hayagriva Interiors. All rights reserved.
        </div>
        <div className="text-[10px] sm:text-xs text-theme-grey/50 flex gap-6">
          <a href="#" className="hover:text-theme-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-theme-gold transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
