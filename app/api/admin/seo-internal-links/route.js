import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// GET /api/admin/seo-internal-links — list all internal links (admin only)
export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { data, error } = await insforge.database
      .from('seo_internal_links')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return json({ error: error.message }, 500)
    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// POST /api/admin/seo-internal-links — create a new internal link (admin only)
export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const body = await request.json()
    const { keyword, target_url, open_in_new_tab = false } = body

    if (!keyword?.trim()) {
      return json({ error: 'Anchor Text (Keyword) is required.' }, 400)
    }
    if (!target_url?.trim()) {
      return json({ error: 'Destination URL is required.' }, 400)
    }

    const row = {
      keyword: keyword.trim(),
      target_url: target_url.trim(),
      open_in_new_tab: Boolean(open_in_new_tab),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await insforge.database
      .from('seo_internal_links')
      .insert([row])
      .select()

    if (error) {
      if (error.code === '23505') { // unique key violation
        return json({ error: 'This keyword is already registered as an internal link.' }, 400)
      }
      return json({ error: error.message }, 500)
    }

    return json(data[0], 201)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
