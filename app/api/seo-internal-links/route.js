import { insforge } from '../../../lib/insforge'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// GET /api/seo-internal-links — fetch all configured internal links
export async function GET() {
  try {
    const { data, error } = await insforge.database
      .from('seo_internal_links')
      .select('id, keyword, target_url, open_in_new_tab')
      .order('keyword', { ascending: true })

    if (error) return json({ error: error.message }, 500)
    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
