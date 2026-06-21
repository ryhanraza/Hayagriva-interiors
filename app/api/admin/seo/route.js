import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ── GET ────────────────────────────────────────────────
// ?page=home        → single row
// (no query)        → all rows
export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (page) {
      const { data, error } = await insforge.database
        .from('seo_settings')
        .select('*')
        .eq('page', page)
        .maybeSingle()

      if (error) return json({ error: error.message }, 500)
      return json(data || null)
    }

    const { data, error } = await insforge.database
      .from('seo_settings')
      .select('*')
      .order('page', { ascending: true })

    if (error) return json({ error: error.message }, 500)
    return json(data || [])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// ── PUT ?page=home ─────────────────────────────────────
// Upsert: insert new row or update existing.
export async function PUT(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const body = await request.json()
    const { page, ...fields } = body

    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }

    if (fields.seo_title && fields.seo_title.length > 60) {
      return json({ error: 'SEO title must be 60 characters or fewer.' }, 400)
    }

    if (fields.meta_description && fields.meta_description.length > 160) {
      return json({ error: 'Meta description must be 160 characters or fewer.' }, 400)
    }

    // If a new OG image is being set and the old one had a storage key, remove it.
    if (fields.og_image_key && fields.og_image) {
      const { data: existing } = await insforge.database
        .from('seo_settings')
        .select('og_image_key')
        .eq('page', page)
        .maybeSingle()

      if (existing?.og_image_key && existing.og_image_key !== fields.og_image_key) {
        try {
          await insforge.storage.from('images').remove([existing.og_image_key])
        } catch {
          // Non-critical — old image cleanup is best-effort
        }
      }
    }

    const row = {
      ...fields,
      page,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await insforge.database
      .from('seo_settings')
      .upsert(row, { onConflict: 'page' })
      .select()

    if (error) return json({ error: error.message }, 500)
    return json(data[0])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// ── DELETE ?page=home ──────────────────────────────────
export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return json({ error: 'Page identifier is required.' }, 400)
    }

    // Remove stored image before deleting the row.
    const { data: existing } = await insforge.database
      .from('seo_settings')
      .select('og_image_key')
      .eq('page', page)
      .maybeSingle()

    if (existing?.og_image_key) {
      try {
        await insforge.storage.from('images').remove([existing.og_image_key])
      } catch {
        // Non-critical
      }
    }

    const { error } = await insforge.database
      .from('seo_settings')
      .delete()
      .eq('page', page)

    if (error) return json({ error: error.message }, 500)
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
