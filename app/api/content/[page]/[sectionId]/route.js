import { insforge } from '../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// ── PUT /api/content/[page]/[sectionId] ───────────────
// Update a specific section's properties (Admin only)
export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page, sectionId } = await params
    if (!page || !sectionId) {
      return json({ error: 'Page identifier and Section ID are required.' }, 400)
    }

    const body = await request.json()
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

    const { data, error } = await insforge.database
      .from('page_sections')
      .update(fieldsToUpdate)
      .eq('id', sectionId)
      .eq('page', page)
      .select()

    if (error) {
      return json({ error: error.message }, 500)
    }

    if (!data || data.length === 0) {
      return json({ error: 'Section not found.' }, 404)
    }

    return json(data[0])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// ── DELETE /api/content/[page]/[sectionId] ────────────
// Delete a specific section and clean up its stored images (Admin only)
export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { page, sectionId } = await params
    if (!page || !sectionId) {
      return json({ error: 'Page identifier and Section ID are required.' }, 400)
    }

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

    const { error } = await insforge.database
      .from('page_sections')
      .delete()
      .eq('id', sectionId)
      .eq('page', page)

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
