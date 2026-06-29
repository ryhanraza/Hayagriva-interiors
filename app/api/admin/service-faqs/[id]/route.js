import { insforge } from '../../../../../lib/insforge'
import { verifyAdmin } from '../../../../../lib/admin-auth'

export const dynamic = 'force-dynamic'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

// PUT — update question, answer, and/or is_active
export async function PUT(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { id } = await params
    if (!id) return json({ error: 'FAQ id is required.' }, 400)

    const body = await request.json()
    const updates = { updated_at: new Date().toISOString() }

    if (body.question !== undefined) {
      if (!body.question?.trim()) return json({ error: 'Question cannot be empty.' }, 400)
      updates.question = body.question.trim()
    }
    if (body.answer !== undefined) {
      if (!body.answer?.trim()) return json({ error: 'Answer cannot be empty.' }, 400)
      updates.answer = body.answer.trim()
    }
    if (body.is_active !== undefined) {
      updates.is_active = Boolean(body.is_active)
    }
    if (body.display_order !== undefined) {
      updates.display_order = Number(body.display_order)
    }

    const { data, error } = await insforge.database
      .from('service_faqs')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) return json({ error: error.message }, 500)
    if (!data?.length) return json({ error: 'FAQ not found.' }, 404)
    return json(data[0])
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}

// DELETE — remove a FAQ
export async function DELETE(request, { params }) {
  const auth = await verifyAdmin(request)
  if (auth.error) return json({ error: auth.error }, auth.status)

  try {
    const { id } = await params
    if (!id) return json({ error: 'FAQ id is required.' }, 400)

    const { error } = await insforge.database
      .from('service_faqs')
      .delete()
      .eq('id', id)

    if (error) return json({ error: error.message }, 500)
    return json({ success: true })
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
