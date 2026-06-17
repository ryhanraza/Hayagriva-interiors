import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { 
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { data: contacts, error } = await insforge.database
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(contacts), { 
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

export async function DELETE(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), { 
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing contact ID' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { error } = await insforge.database
      .from('contacts')
      .delete()
      .eq('id', id)

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
