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

// ── GET /api/seo/[page] ───────────────────────────────
// Fetch SEO settings for a specific page (Public)
export async function GET(request, { params }) {
  try {
    const { page } = await params
    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }

    const { data, error } = await insforge.database
      .from('seo_settings')
      .select('*')
      .eq('page', page)
      .maybeSingle()

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json(data || null)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// ── PUT /api/seo/[page] ───────────────────────────────
// Update/upsert SEO settings for a specific page (Admin only)
export async function PUT(request, { params }) {
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
    const { seo_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, og_image_key, robots } = body

    // Validation
    if (seo_title && seo_title.length > 60) {
      return json({ error: 'SEO title must be 60 characters or fewer.' }, 400)
    }
    if (meta_description && meta_description.length > 160) {
      return json({ error: 'Meta description must be 160 characters or fewer.' }, 400)
    }

    // Clean up old image if a new one is uploaded
    if (og_image_key && og_image) {
      const { data: existing } = await insforge.database
        .from('seo_settings')
        .select('og_image_key')
        .eq('page', page)
        .maybeSingle()

      if (existing?.og_image_key && existing.og_image_key !== og_image_key) {
        try {
          await insforge.storage.from('images').remove([existing.og_image_key])
        } catch {
          // Non-critical cleanup
        }
      }
    }

    const row = {
      page,
      seo_title,
      meta_description,
      meta_keywords,
      canonical_url,
      og_title,
      og_description,
      og_image,
      og_image_key,
      robots: robots || 'index, follow',
      updated_at: new Date().toISOString()
    }

    const { data, error } = await insforge.database
      .from('seo_settings')
      .upsert(row, { onConflict: 'page' })
      .select()

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json(data[0])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
