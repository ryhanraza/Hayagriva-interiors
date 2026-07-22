import { insforge } from '../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// PUT /api/admin/seo-internal-links/[id] — update an existing internal link (admin only)
export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { id } = await params
    if (!id) return json({ error: 'Link ID is required.' }, 400)

    const body = await request.json()
    const { keyword, target_url, open_in_new_tab } = body

    const updates = {}
    if (keyword !== undefined) {
      if (!keyword.trim()) return json({ error: 'Anchor Text (Keyword) cannot be empty.' }, 400)
      updates.keyword = keyword.trim()
    }
    if (target_url !== undefined) {
      if (!target_url.trim()) return json({ error: 'Destination URL cannot be empty.' }, 400)
      updates.target_url = target_url.trim()
    }
    if (open_in_new_tab !== undefined) {
      updates.open_in_new_tab = Boolean(open_in_new_tab)
    }
    updates.updated_at = new Date().toISOString()

    const { data, error } = await insforge.database
      .from('seo_internal_links')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      if (error.code === '23505') { // unique constraint violation
        return json({ error: 'This keyword is already registered as an internal link.' }, 400)
      }
      return json({ error: error.message }, 500)
    }

    if (!data || data.length === 0) {
      return json({ error: 'Internal link not found.' }, 404)
    }

    return json(data[0])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// DELETE /api/admin/seo-internal-links/[id] — delete an internal link (admin only)
export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { id } = await params
    if (!id) return json({ error: 'Link ID is required.' }, 400)

    const { data, error } = await insforge.database
      .from('seo_internal_links')
      .delete()
      .eq('id', id)
      .select()

    if (error) return json({ error: error.message }, 500)
    if (!data || data.length === 0) {
      return json({ error: 'Internal link not found.' }, 404)
    }

    return json({ success: true, message: 'Internal link deleted successfully.' })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
