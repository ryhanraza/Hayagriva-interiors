import { insforge } from '../../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/projects/[id]/images — add one or more gallery images
export async function POST(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { id } = await params

  try {
    const body = await request.json()
    // Accept either a single image object or an array
    const incoming = Array.isArray(body.images) ? body.images : [body]

    if (incoming.length === 0) {
      return new Response(JSON.stringify({ error: 'No images provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const rows = incoming.map((img) => ({
      project_id: id,
      image_url: img.image_url,
      image_key: img.image_key || null,
      caption: img.caption || null,
      sort_order: typeof img.sort_order === 'number' ? img.sort_order : 0
    }))

    const { data, error } = await insforge.database
      .from('project_images')
      .insert(rows)
      .select()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// DELETE /api/admin/projects/[id]/images?imageId=... — remove a single gallery image
export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const imageId = searchParams.get('imageId')

  if (!imageId) {
    return new Response(JSON.stringify({ error: 'Missing imageId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Fetch the row to get storage key for cleanup
    const { data: row, error: getError } = await insforge.database
      .from('project_images')
      .select('image_key')
      .eq('id', imageId)
      .eq('project_id', id)
      .maybeSingle()

    if (getError) {
      return new Response(JSON.stringify({ error: getError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Best-effort storage removal
    if (row?.image_key) {
      const { error: storageError } = await insforge.storage
        .from('images')
        .remove(row.image_key)
      if (storageError) {
        console.error('Gallery image storage delete failed, continuing:', storageError)
      }
    }

    const { error } = await insforge.database
      .from('project_images')
      .delete()
      .eq('id', imageId)
      .eq('project_id', id)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
