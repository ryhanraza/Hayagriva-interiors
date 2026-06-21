import { insforge } from './insforge'
import { DEFAULT_SEO, SITE_URL } from './seo-pages'

/**
 * Fetch SEO settings for a page from the database.
 * Returns null (not throws) on any failure so rendering never breaks.
 */
export async function getSeoForPage(page) {
  try {
    const { data, error } = await insforge.database
      .from('seo_settings')
      .select('*')
      .eq('page', page)
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Build a Next.js Metadata object from a DB row.
 * Falls back to DEFAULT_SEO for any missing fields.
 */
export function buildMetadata(seo) {
  if (!seo) return buildMetadata(DEFAULT_SEO)

  const title = seo.seo_title || DEFAULT_SEO.seo_title
  const description = seo.meta_description || DEFAULT_SEO.meta_description
  const ogTitle = seo.og_title || title
  const ogDescription = seo.og_description || description
  const canonicalUrl = seo.canonical_url ? new URL(seo.canonical_url, SITE_URL).href : undefined

  const openGraph = {
    title: ogTitle,
    description: ogDescription,
    siteName: 'Hayagriva Interiors',
    locale: 'en_IN',
    type: 'website',
  }

  if (seo.og_image) {
    openGraph.images = [{ url: seo.og_image, width: 1200, height: 630, alt: ogTitle }]
  }

  // The page path is resolved by the caller if needed; canonicalUrl takes priority.
  openGraph.url = canonicalUrl || SITE_URL

  const robotsValue = seo.robots || DEFAULT_SEO.robots
  const robots = {}
  const parts = robotsValue.split(',').map(s => s.trim().toLowerCase())
  if (parts.includes('noindex')) robots.index = false
  if (parts.includes('nofollow')) robots.follow = false

  return {
    title,
    description,
    keywords: seo.meta_keywords || undefined,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(seo.og_image ? { images: [seo.og_image] } : {}),
    },
    robots,
  }
}
