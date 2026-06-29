import { insforge } from '../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// PUT — batch reorder: { orders: [{ id, display_order }] }
export async function PUT(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const body = await request.json()
    const orders = body?.orders

    if (!Array.isArray(orders) || orders.length === 0) {
      return json({ error: 'orders array is required.' }, 400)
    }

    const now = new Date().toISOString()
    const results = []

    for (const item of orders) {
      if (!item?.id || item.display_order === undefined) continue

      const { data, error } = await insforge.database
        .from('service_faqs')
        .update({ display_order: Number(item.display_order), updated_at: now })
        .eq('id', item.id)
        .select()

      if (error) return json({ error: error.message }, 500)
      if (data?.[0]) results.push(data[0])
    }

    return json(results)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
