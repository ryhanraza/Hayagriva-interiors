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

    // Append new images at the end of the existing list so order stays stable
    let startOrder = 0
    const { data: existing, error: countErr } = await insforge.database
      .from('project_images')
      .select('id, sort_order')
      .eq('project_id', id)
      .order('sort_order', { ascending: false })
      .limit(1)

    if (!countErr && existing && existing.length > 0) {
      startOrder = (existing[0].sort_order || 0) + 1
    }

    const rows = incoming.map((img, idx) => ({
      project_id: id,
      image_url: img.image_url,
      image_key: img.image_key || null,
      caption: img.caption || null,
      sort_order: typeof img.sort_order === 'number' ? img.sort_order : startOrder + idx
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

// PATCH /api/admin/projects/[id]/images — bulk re-order (save sort_order for many rows)
//   body: { orders: [{ id, order }] }
export async function PATCH(request, { params }) {
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
    const orders = Array.isArray(body?.orders) ? body.orders : []

    if (orders.length === 0) {
      return new Response(JSON.stringify({ error: 'No orders provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update each row individually — keeps things simple and order-safe.
    for (const item of orders) {
      if (!item?.id || typeof item.order !== 'number') continue
      const { error } = await insforge.database
        .from('project_images')
        .update({ sort_order: item.order })
        .eq('id', item.id)
        .eq('project_id', id)
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
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

// PUT /api/admin/projects/[id]/images — replace a single image (new file) or set as cover
//   body: { imageId, image_url, image_key }            → replace this image's file
//   body: { imageId, setCover: true }                  → promote this image to projects.image
export async function PUT(request, { params }) {
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
    const { imageId, setCover, image_url, image_key } = body || {}

    if (!imageId) {
      return new Response(JSON.stringify({ error: 'Missing imageId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // ---- Set as cover: copy this image's URL/key onto the project row ----
    if (setCover) {
      const { data: row, error: getError } = await insforge.database
        .from('project_images')
        .select('image_url, image_key')
        .eq('id', imageId)
        .eq('project_id', id)
        .maybeSingle()

      if (getError) {
        return new Response(JSON.stringify({ error: getError.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      if (!row) {
        return new Response(JSON.stringify({ error: 'Image not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const { error: updateErr } = await insforge.database
        .from('projects')
        .update({ image: row.image_url, image_key: row.image_key || null })
        .eq('id', id)

      if (updateErr) {
        return new Response(JSON.stringify({ error: updateErr.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(
        JSON.stringify({ success: true, image: row.image_url, image_key: row.image_key || null }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // ---- Replace image file ----
    if (image_url) {
      // Clean up the previous file from storage (best-effort)
      const { data: prev } = await insforge.database
        .from('project_images')
        .select('image_key')
        .eq('id', imageId)
        .eq('project_id', id)
        .maybeSingle()
      if (prev?.image_key) {
        const { error: storageError } = await insforge.storage
          .from('images')
          .remove(prev.image_key)
        if (storageError) {
          console.error('Replace: old file delete failed, continuing:', storageError)
        }
      }

      const { data, error } = await insforge.database
        .from('project_images')
        .update({ image_url, image_key: image_key || null })
        .eq('id', imageId)
        .eq('project_id', id)
        .select()

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify(data?.[0] || { success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Nothing to update' }), {
      status: 400,
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
