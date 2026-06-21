// Canonical page registry — single source of truth for SEO-managed pages.
// Add a new entry here + create its server wrapper to enable SEO for future pages.

export const SEO_PAGES = [
  { page: 'home',      label: 'Home',                path: '/' },
  { page: 'about',     label: 'About',               path: '/about' },
  { page: 'services',  label: 'Services',            path: '/services' },
  { page: 'portfolio', label: 'Portfolio / Projects', path: '/portfolio' },
  { page: 'contact',   label: 'Contact',             path: '/contact' },
]

export const DEFAULT_SEO = {
  seo_title: 'Hayagriva Interiors',
  meta_description: 'Premium Interior Design Studio',
  meta_keywords: '',
  canonical_url: '',
  og_title: 'Hayagriva Interiors',
  og_description: 'Premium Interior Design Studio',
  og_image: '',
  robots: 'index, follow',
}

export const SITE_URL = 'https://hayagrivainteriors.com'
