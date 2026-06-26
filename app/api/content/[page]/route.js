import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'
import { revalidatePath } from 'next/cache'

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
  console.log('[API] POST /api/content/[page] — entry')

  const auth = await verifyAdmin(request)
  if (auth.error) {
    console.warn('[API] POST /api/content/[page] — auth failed:', auth.error)
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page } = await params
    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }
    console.log('[API] POST /api/content — page:', page)

    const body = await request.json()
    console.log('[API] POST /api/content — payload type:', body?.type)
    const { type, title, subtitle, description, content, images, buttons, layout, custom_json, is_visible } = body

    if (!type) {
      return json({ error: 'Section type is required.' }, 400)
    }

    // Fetch existing sections to determine order
    console.log('[API] POST /api/content — fetching existing sections for order calculation')
    const { data: existing, error: fetchErr } = await insforge.database
      .from('page_sections')
      .select('section_order')
      .eq('page', page)

    if (fetchErr) {
      console.error('[API] POST /api/content — fetch existing error:', fetchErr.message)
      return json({ error: fetchErr.message }, 500)
    }

    let nextOrder = 0
    if (existing && existing.length > 0) {
      const maxOrder = Math.max(...existing.map(s => s.section_order || 0))
      nextOrder = maxOrder + 1
    }
    console.log('[API] POST /api/content — next section_order:', nextOrder)

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

    console.log('[API] POST /api/content — inserting row into page_sections')
    const { data, error } = await insforge.database
      .from('page_sections')
      .insert([row])
      .select()

    if (error) {
      console.error('[API] POST /api/content — DB insert error:', error.message)
      return json({ error: error.message }, 500)
    }

    console.log('[API] POST /api/content — insert success, id:', data[0]?.id)

    // Bust the Next.js page cache so the public site shows the new section immediately
    try {
      const pagePath = page === 'home' ? '/' : `/${page}`
      revalidatePath(pagePath)
      console.log('[API] POST /api/content — revalidated path:', pagePath)
    } catch (rvErr) {
      console.warn('[API] POST /api/content — revalidatePath failed (non-fatal):', rvErr.message)
    }

    return json(data[0], 201)
  } catch (err) {
    console.error('[API] POST /api/content — unexpected error:', err.message)
    return json({ error: err.message }, 500)
  }
}
