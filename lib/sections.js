import { insforge } from './insforge'

/**
 * Fetch visible sections for a page directly from the database (Server-side).
 * Returns an empty array on any failure so rendering never breaks.
 */
export async function getSectionsForPage(page) {
  try {
    const { data, error } = await insforge.database
      .from('page_sections')
      .select('*')
      .eq('page', page)
      .eq('is_visible', true)
      .order('section_order', { ascending: true })

    if (error) {
      console.error(`Error fetching sections for ${page}:`, error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error(`Exception fetching sections for ${page}:`, err)
    return []
  }
}
