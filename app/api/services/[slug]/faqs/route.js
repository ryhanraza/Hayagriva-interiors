import { insforge } from '../../../../../lib/insforge'
import { SERVICE_SLUGS } from '../../../../../lib/service-options'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// GET /api/services/[slug]/faqs — active FAQs for a service (public)
export async function GET(_request, { params }) {
  try {
    const { slug } = await params
    if (!slug || !SERVICE_SLUGS.includes(slug)) {
      return json({ error: 'Service not found.' }, 404)
    }

    const { data, error } = await insforge.database
      .from('service_faqs')
      .select('id, service_id, question, answer, display_order')
      .eq('service_id', slug)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) return json({ error: error.message }, 500)
    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
