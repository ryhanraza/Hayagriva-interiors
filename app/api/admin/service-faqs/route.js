import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'
import { SERVICE_SLUGS } from '../../../../lib/service-options'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// GET ?service_id=modular-kitchen — all FAQs for a service (admin)
export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('service_id') || searchParams.get('serviceId')

    if (!serviceId) {
      return json({ error: 'service_id is required.' }, 400)
    }

    if (!SERVICE_SLUGS.includes(serviceId)) {
      return json({ error: 'Invalid service_id.' }, 400)
    }

    const { data, error } = await insforge.database
      .from('service_faqs')
      .select('*')
      .eq('service_id', serviceId)
      .order('display_order', { ascending: true })

    if (error) return json({ error: error.message }, 500)
    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// POST — create a new FAQ
export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const body = await request.json()
    const { service_id, question, answer, is_active = true } = body

    if (!service_id || !SERVICE_SLUGS.includes(service_id)) {
      return json({ error: 'Valid service_id is required.' }, 400)
    }
    if (!question?.trim()) {
      return json({ error: 'Question is required.' }, 400)
    }
    if (!answer?.trim()) {
      return json({ error: 'Answer is required.' }, 400)
    }

    const { data: existing } = await insforge.database
      .from('service_faqs')
      .select('display_order')
      .eq('service_id', service_id)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = existing?.length ? (existing[0].display_order ?? 0) + 1 : 0

    const row = {
      service_id,
      question: question.trim(),
      answer: answer.trim(),
      display_order: nextOrder,
      is_active: Boolean(is_active),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await insforge.database
      .from('service_faqs')
      .insert([row])
      .select()

    if (error) return json({ error: error.message }, 500)
    return json(data[0], 201)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
