'use client'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search, Check } from 'lucide-react'

// Country codes dataset (flag emoji + dial code + ISO + typical national number length)
// `len` = expected digit count of the national number (used for validation)
export const COUNTRY_CODES = [
  { iso: 'IN', name: 'India', flag: '🇮🇳', dial: '+91', len: 10 },
  { iso: 'US', name: 'United States', flag: '🇺🇸', dial: '+1', len: 10 },
  { iso: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial: '+44', len: 10 },
  { iso: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dial: '+971', len: 9 },
  { iso: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dial: '+966', len: 9 },
  { iso: 'QA', name: 'Qatar', flag: '🇶🇦', dial: '+974', len: 8 },
  { iso: 'KW', name: 'Kuwait', flag: '🇰🇼', dial: '+965', len: 8 },
  { iso: 'BH', name: 'Bahrain', flag: '🇧🇭', dial: '+973', len: 8 },
  { iso: 'OM', name: 'Oman', flag: '🇴🇲', dial: '+968', len: 8 },
  { iso: 'SG', name: 'Singapore', flag: '🇸🇬', dial: '+65', len: 8 },
  { iso: 'MY', name: 'Malaysia', flag: '🇲🇾', dial: '+60', len: 9 },
  { iso: 'AU', name: 'Australia', flag: '🇦🇺', dial: '+61', len: 9 },
  { iso: 'CA', name: 'Canada', flag: '🇨🇦', dial: '+1', len: 10 },
  { iso: 'PK', name: 'Pakistan', flag: '🇵🇰', dial: '+92', len: 10 },
  { iso: 'BD', name: 'Bangladesh', flag: '🇧🇩', dial: '+880', len: 10 },
  { iso: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dial: '+94', len: 9 },
  { iso: 'NP', name: 'Nepal', flag: '🇳🇵', dial: '+977', len: 10 },
  { iso: 'ZA', name: 'South Africa', flag: '🇿🇦', dial: '+27', len: 9 },
  { iso: 'NG', name: 'Nigeria', flag: '🇳🇬', dial: '+234', len: 10 },
  { iso: 'DE', name: 'Germany', flag: '🇩🇪', dial: '+49', len: 11 },
  { iso: 'FR', name: 'France', flag: '🇫🇷', dial: '+33', len: 9 },
  { iso: 'IT', name: 'Italy', flag: '🇮🇹', dial: '+39', len: 10 },
  { iso: 'ES', name: 'Spain', flag: '🇪🇸', dial: '+34', len: 9 },
  { iso: 'NL', name: 'Netherlands', flag: '🇳🇱', dial: '+31', len: 9 },
  { iso: 'BE', name: 'Belgium', flag: '🇧🇪', dial: '+32', len: 9 },
  { iso: 'CH', name: 'Switzerland', flag: '🇨🇭', dial: '+41', len: 9 },
  { iso: 'SE', name: 'Sweden', flag: '🇸🇪', dial: '+46', len: 9 },
  { iso: 'NO', name: 'Norway', flag: '🇳🇴', dial: '+47', len: 8 },
  { iso: 'IE', name: 'Ireland', flag: '🇮🇪', dial: '+353', len: 9 },
  { iso: 'NZ', name: 'New Zealand', flag: '🇳🇿', dial: '+64', len: 9 },
  { iso: 'ID', name: 'Indonesia', flag: '🇮🇩', dial: '+62', len: 10 },
  { iso: 'TH', name: 'Thailand', flag: '🇹🇭', dial: '+66', len: 9 },
  { iso: 'PH', name: 'Philippines', flag: '🇵🇭', dial: '+63', len: 10 },
  { iso: 'VN', name: 'Vietnam', flag: '🇻🇳', dial: '+84', len: 9 },
  { iso: 'HK', name: 'Hong Kong', flag: '🇭🇰', dial: '+852', len: 8 },
  { iso: 'JP', name: 'Japan', flag: '🇯🇵', dial: '+81', len: 10 },
  { iso: 'CN', name: 'China', flag: '🇨🇳', dial: '+86', len: 11 },
  { iso: 'KR', name: 'South Korea', flag: '🇰🇷', dial: '+82', len: 10 },
  { iso: 'TR', name: 'Turkey', flag: '🇹🇷', dial: '+90', len: 10 },
  { iso: 'EG', name: 'Egypt', flag: '🇪🇬', dial: '+20', len: 10 },
  { iso: 'BR', name: 'Brazil', flag: '🇧🇷', dial: '+55', len: 11 },
  { iso: 'MX', name: 'Mexico', flag: '🇲🇽', dial: '+52', len: 10 },
]

/**
 * Reusable phone input with a searchable country-code dropdown.
 *
 * Props:
 *  - value: string          // the raw national number digits (no code)
 *  - onChange: (digits) => void
 *  - onCountryChange: (country) => void  // optional
 *  - placeholder: string
 *  - variant: 'light' | 'dark'   // styling variant to match parent form
 *  - defaultIso: string          // ISO code of the initially selected country
 */
export default function PhoneInput({
  value,
  onChange,
  onCountryChange,
  placeholder = 'Phone Number',
  variant = 'light',
  defaultIso = 'IN',
}) {
  const [country, setCountry] = useState(
    COUNTRY_CODES.find((c) => c.iso === defaultIso) || COUNTRY_CODES[0]
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Styling presets per variant
  const isDark = variant === 'dark'
  const fieldBase = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-gold focus:ring-gold/25'
    : 'bg-charcoal/5 border-charcoal/10 text-charcoal placeholder-charcoal/40 focus:border-gold focus:ring-gold/20'
  const dropdownPanel = isDark
    ? 'bg-charcoal border-white/10'
    : 'bg-white border-charcoal/10'
  const searchInput = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
    : 'bg-charcoal/5 border-charcoal/10 text-charcoal placeholder-charcoal/40'

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [dropdownOpen])

  const filteredCountries = COUNTRY_CODES.filter((c) => {
    const q = query.toLowerCase().trim()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.iso.toLowerCase().includes(q)
    )
  })

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, country.len)
    onChange(cleaned)
  }

  const selectCountry = (c) => {
    setCountry(c)
    setDropdownOpen(false)
    setQuery('')
    // Trim existing phone if longer than the new country's max length
    onChange(value.slice(0, c.len))
    if (onCountryChange) onCountryChange(c)
  }

  return (
    <div className="flex gap-2">
      {/* Country code dropdown trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className={`h-full flex items-center gap-2 px-4 py-4 border rounded-xl focus:outline-none focus:ring-1 text-sm transition-all whitespace-nowrap ${fieldBase}`}
          aria-label="Select country code"
          aria-expanded={dropdownOpen}
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="font-bold">{country.dial}</span>
          <ChevronDown
            size={14}
            className={`opacity-50 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={`absolute top-full left-0 mt-2 w-72 max-h-80 overflow-hidden border rounded-2xl shadow-2xl z-50 flex flex-col ${dropdownPanel}`}
            >
              {/* Search input */}
              <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-charcoal/10'}`}>
                <div className="relative">
                  <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40' : 'text-charcoal/40'}`} />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search country or code"
                    className={`w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-xs ${searchInput}`}
                  />
                </div>
              </div>

              {/* Country list */}
              <div className="overflow-y-auto flex-1">
                {filteredCountries.length === 0 ? (
                  <div className={`px-4 py-6 text-center text-xs ${isDark ? 'text-white/40' : 'text-charcoal/40'}`}>
                    No countries found
                  </div>
                ) : (
                  filteredCountries.map((c) => (
                    <button
                      type="button"
                      key={c.iso}
                      onClick={() => selectCountry(c)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gold/5 transition-colors ${
                        country.iso === c.iso ? 'bg-gold/10' : ''
                      }`}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className={`flex-1 text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-charcoal'}`}>{c.name}</span>
                      <span className={`text-xs font-mono ${isDark ? 'text-white/60' : 'text-charcoal/60'}`}>{c.dial}</span>
                      {country.iso === c.iso && <Check size={14} className="text-gold shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phone number input */}
      <input
        type="tel"
        name="phone"
        value={value}
        onChange={handlePhoneChange}
        inputMode="numeric"
        placeholder={`${placeholder} (${country.len} digits)`}
        className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-1 text-sm transition-all ${fieldBase}`}
        required
      />
    </div>
  )
}

/**
 * Helper: returns the full international phone string for a given ISO + digits.
 * Returns null if the digit count doesn't match the country's expected length.
 */
export function buildFullPhone(country, digits) {
  const cleaned = String(digits || '').replace(/\D/g, '')
  if (cleaned.length !== country.len) return null
  return `${country.dial} ${cleaned}`
}

/**
 * Find a country object by ISO code (falls back to India).
 */
export function getCountryByIso(iso) {
  return COUNTRY_CODES.find((c) => c.iso === iso) || COUNTRY_CODES[0]
}
