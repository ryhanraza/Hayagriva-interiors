import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ── PATCH /api/content/reorder ────────────────────────
// Reorder multiple sections at once (Admin only)
// Body: { orders: [ { id: 'uuid', order: 0 }, ... ] }
export async function PATCH(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const body = await request.json()
    const { orders } = body

    if (!orders || !Array.isArray(orders)) {
      return json({ error: 'Invalid payload: orders array is required.' }, 400)
    }

    const updatePromises = orders.map((item) => {
      if (!item.id || item.order === undefined) return Promise.resolve()
      return insforge.database
        .from('page_sections')
        .update({
          section_order: item.order,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
    })

    const results = await Promise.all(updatePromises)
    const errors = results.map(r => r?.error).filter(Boolean)

    if (errors.length > 0) {
      return json({ error: 'Some updates failed: ' + errors[0].message }, 500)
    }

    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
