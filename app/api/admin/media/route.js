import { verifyAdmin } from '../../../../lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// GET /api/admin/media — Retrieve list of all uploaded files in 'images' bucket
export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase.storage.from('images').list('', {
      limit: 500,
      sortBy: { column: 'created_at', order: 'desc' }
    })

    if (error) {
      return json({ error: error.message }, 500)
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co'

    const files = (data || [])
      .filter((f) => f.name && !f.id?.endsWith('/'))
      .map((f) => ({
        key: f.name,
        url: `${supabaseUrl}/storage/v1/object/public/images/${f.name}`,
        size: f.metadata?.size || 0,
        uploadedAt: f.created_at || null,
      }))

    return json(files)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// DELETE /api/admin/media?key=... — Delete a file from 'images' bucket
export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return json({ error: 'Missing object key' }, 400)
    }

    const supabase = getAdminClient()
    const { error } = await supabase.storage.from('images').remove([key])

    if (error) {
      return json({ error: error.message }, 500)
    }

    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
