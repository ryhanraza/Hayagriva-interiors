import { insforge } from '../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../lib/admin-auth'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ── PUT /api/content/[page]/[sectionId] ───────────────
// Update a specific section's properties (Admin only)
export async function PUT(request, { params }) {
  console.log('[API] PUT /api/content/[page]/[sectionId] — entry')

  const auth = await verifyAdmin(request)
  if (auth.error) {
    console.warn('[API] PUT — auth failed:', auth.error)
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page, sectionId } = await params
    if (!page || !sectionId) {
      return json({ error: 'Page identifier and Section ID are required.' }, 400)
    }
    console.log('[API] PUT — page:', page, 'sectionId:', sectionId)

    const body = await request.json()
    console.log('[API] PUT — fields to update:', Object.keys(body).join(', '))
    const { type, title, subtitle, description, content, images, buttons, layout, custom_json, is_visible } = body

    // Optional field cleanup: find if old images need to be deleted
    // For simplicity, we compare incoming images with existing ones and delete ones that are removed
    if (images) {
      const { data: existingSection } = await insforge.database
        .from('page_sections')
        .select('images')
        .eq('id', sectionId)
        .maybeSingle()

      if (existingSection?.images && Array.isArray(existingSection.images)) {
        const existingKeys = existingSection.images.map(img => img.key).filter(Boolean)
        const incomingKeys = images.map(img => img.key).filter(Boolean)

        const keysToDelete = existingKeys.filter(k => !incomingKeys.includes(k))
        if (keysToDelete.length > 0) {
          try {
            await insforge.storage.from('images').remove(keysToDelete)
          } catch {
            // Non-blocking cleanup
          }
        }
      }
    }

    const fieldsToUpdate = {
      updated_at: new Date().toISOString()
    }

    if (type !== undefined) fieldsToUpdate.type = type
    if (title !== undefined) fieldsToUpdate.title = title
    if (subtitle !== undefined) fieldsToUpdate.subtitle = subtitle
    if (description !== undefined) fieldsToUpdate.description = description
    if (content !== undefined) fieldsToUpdate.content = content
    if (images !== undefined) fieldsToUpdate.images = images
    if (buttons !== undefined) fieldsToUpdate.buttons = buttons
    if (layout !== undefined) fieldsToUpdate.layout = layout
    if (custom_json !== undefined) fieldsToUpdate.custom_json = custom_json
    if (is_visible !== undefined) fieldsToUpdate.is_visible = is_visible

    console.log('[API] PUT — running DB update on page_sections')
    const { data, error } = await insforge.database
      .from('page_sections')
      .update(fieldsToUpdate)
      .eq('id', sectionId)
      .eq('page', page)
      .select()

    if (error) {
      console.error('[API] PUT — DB update error:', error.message)
      return json({ error: error.message }, 500)
    }

    if (!data || data.length === 0) {
      console.warn('[API] PUT — no rows updated for sectionId:', sectionId)
      return json({ error: 'Section not found.' }, 404)
    }

    console.log('[API] PUT — update success, section id:', data[0]?.id)

    // Bust the Next.js page cache so the public site shows the updated content immediately
    try {
      const pagePath = page === 'home' ? '/' : `/${page}`
      revalidatePath(pagePath)
      console.log('[API] PUT — revalidated path:', pagePath)
    } catch (rvErr) {
      console.warn('[API] PUT — revalidatePath failed (non-fatal):', rvErr.message)
    }

    return json(data[0])
  } catch (err) {
    console.error('[API] PUT — unexpected error:', err.message)
    return json({ error: err.message }, 500)
  }
}

// ── DELETE /api/content/[page]/[sectionId] ────────────
// Delete a specific section and clean up its stored images (Admin only)
export async function DELETE(request, { params }) {
  console.log('[API] DELETE /api/content/[page]/[sectionId] — entry')

  const auth = await verifyAdmin(request)
  if (auth.error) {
    console.warn('[API] DELETE — auth failed:', auth.error)
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page, sectionId } = await params
    if (!page || !sectionId) {
      return json({ error: 'Page identifier and Section ID are required.' }, 400)
    }
    console.log('[API] DELETE — page:', page, 'sectionId:', sectionId)

    // Retrieve images to clean up storage
    const { data: existing } = await insforge.database
      .from('page_sections')
      .select('images')
      .eq('id', sectionId)
      .maybeSingle()

    if (existing?.images && Array.isArray(existing.images)) {
      const keys = existing.images.map(img => img.key).filter(Boolean)
      if (keys.length > 0) {
        try {
          await insforge.storage.from('images').remove(keys)
        } catch {
          // Non-blocking
        }
      }
    }

    console.log('[API] DELETE — deleting from page_sections')
    const { error } = await insforge.database
      .from('page_sections')
      .delete()
      .eq('id', sectionId)
      .eq('page', page)

    if (error) {
      console.error('[API] DELETE — DB error:', error.message)
      return json({ error: error.message }, 500)
    }

    console.log('[API] DELETE — success')

    // Bust the Next.js page cache so the public site no longer shows the deleted section
    try {
      const pagePath = page === 'home' ? '/' : `/${page}`
      revalidatePath(pagePath)
      console.log('[API] DELETE — revalidated path:', pagePath)
    } catch (rvErr) {
      console.warn('[API] DELETE — revalidatePath failed (non-fatal):', rvErr.message)
    }

    return json({ success: true })
  } catch (err) {
    console.error('[API] DELETE — unexpected error:', err.message)
    return json({ error: err.message }, 500)
  }
}
