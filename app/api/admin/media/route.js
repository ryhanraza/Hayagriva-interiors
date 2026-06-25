import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// GET /api/admin/media — Retrieve list of all uploaded files in 'images' bucket
export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return json({ error: auth.error }, auth.status)
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app'
    const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || 'ik_fd319524a5e7923aca5217024108b3d7'

    const res = await fetch(`${baseUrl}/api/storage/buckets/images/objects?limit=500`, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      const errText = await res.text()
      return json({ error: `Backend returned status ${res.status}: ${errText}` }, res.status)
    }

    const result = await res.json()
    return json(result.data || [])
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

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app'
    const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || 'ik_fd319524a5e7923aca5217024108b3d7'

    const cleanKey = key.startsWith('/') ? key.substring(1) : key
    const url = `${baseUrl}/api/storage/buckets/images/objects/${cleanKey}`

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      const errText = await res.text()
      return json({ error: `Backend returned status ${res.status}: ${errText}` }, res.status)
    }

    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
