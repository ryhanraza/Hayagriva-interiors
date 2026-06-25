import { insforge } from './insforge'

const FETCH_TIMEOUT_MS = 6000

/**
 * Fetch visible sections for a page directly from the database (Server-side).
 * Returns an empty array on any failure so rendering never breaks.
 * Wraps the SDK call in a Promise.race so the fallback renders quickly
 * if the backend is unreachable in the SSR context.
 */
export async function getSectionsForPage(page) {
  try {
    const query = insforge.database
      .from('page_sections')
      .select('*')
      .eq('page', page)
      .eq('is_visible', true)
      .order('section_order', { ascending: true })

    const result = await Promise.race([
      query,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`DB fetch timed out after ${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS)
      ),
    ])

    if (result.error) {
      console.error(`Error fetching sections for ${page}:`, result.error.message)
      return []
    }
    return result.data || []
  } catch (err) {
    console.error(`Exception fetching sections for ${page}:`, err.message || err)
    return []
  }
}

/**
 * Fetch a custom page definition by its slug from the database.
 */
export async function getCustomPageBySlug(slug) {
  try {
    const query = insforge.database
      .from('custom_pages')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    const result = await Promise.race([
      query,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB fetch timed out')), FETCH_TIMEOUT_MS)
      ),
    ])

    if (result.error) return null
    return result.data
  } catch {
    return null
  }
}

