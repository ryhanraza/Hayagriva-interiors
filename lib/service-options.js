// Service slugs used for service-specific FAQ management.
// Matches the keys in app/services/[slug]/page.jsx servicesMap.
export const SERVICE_OPTIONS = [
  { slug: 'modular-kitchen', title: 'Modular Kitchen' },
  { slug: 'bedroom', title: 'Bedroom Interiors' },
  { slug: 'living-room', title: 'Living Room Design' },
  { slug: 'space-planning', title: 'Space Planning & 3D Design' },
  { slug: 'turnkey-solutions', title: 'Turnkey Interiors' },
  { slug: 'renovation', title: 'Renovation' }
]

export const SERVICE_SLUGS = SERVICE_OPTIONS.map((s) => s.slug)

export function getServiceTitle(slug) {
  return SERVICE_OPTIONS.find((s) => s.slug === slug)?.title || slug
}
