import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ── GET /api/content/[page] ───────────────────────────
// Retrieve all sections for a page.
// Public visitors see only visible sections. Admin sees everything.
export async function GET(request, { params }) {
  try {
    const { page } = await params
    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }

    // Check if requester is admin
    const auth = await verifyAdmin(request)
    const isAdmin = !auth.error

    let query = insforge.database
      .from('page_sections')
      .select('*')
      .eq('page', page)

    if (!isAdmin) {
      query = query.eq('is_visible', true)
    }

    const { data, error } = await query.order('section_order', { ascending: true })

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// ── POST /api/content/[page] ──────────────────────────
// Add a new section to a page (Admin only)
export async function POST(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page } = await params
    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }

    const body = await request.json()
    const { type, title, subtitle, description, content, images, buttons, layout, custom_json, is_visible } = body

    if (!type) {
      return json({ error: 'Section type is required.' }, 400)
    }

    // Fetch existing sections to determine order
    const { data: existing, error: fetchErr } = await insforge.database
      .from('page_sections')
      .select('section_order')
      .eq('page', page)

    if (fetchErr) {
      return json({ error: fetchErr.message }, 500)
    }

    let nextOrder = 0
    if (existing && existing.length > 0) {
      const maxOrder = Math.max(...existing.map(s => s.section_order || 0))
      nextOrder = maxOrder + 1
    }

    const row = {
      page,
      type,
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      content: content || '',
      images: images || [],
      buttons: buttons || [],
      layout: layout || 'full-width',
      custom_json: custom_json || {},
      is_visible: is_visible !== false,
      section_order: nextOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await insforge.database
      .from('page_sections')
      .insert([row])
      .select()

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json(data[0], 201)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
