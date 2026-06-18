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
    const { data: expenses, error } = await insforge.database
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(expenses), {
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

export async function POST(request) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const data = await request.json()
    const { amount, category, description, date, type } = data

    const amountValue = parseFloat(amount)
    const allowedType = type === 'income' ? 'income' : 'expense'
    const expenseDate = date || new Date().toISOString().split('T')[0]

    if (Number.isNaN(amountValue) || amountValue < 0 || !category || !description) {
      return new Response(JSON.stringify({ error: 'Invalid transaction data. Please provide a valid amount, category and description.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const expenseRow = {
      amount: amountValue,
      category: category.trim(),
      description: description.trim(),
      date: expenseDate,
      user_id: auth.user.id
    }

    if (type !== undefined) {
      expenseRow.type = allowedType
    }

    let inserted, error
    let insertResponse = await insforge.database
      .from('expenses')
      .insert([expenseRow])
      .select()

    inserted = insertResponse.data
    error = insertResponse.error

    if (error && error.message?.toLowerCase().includes('type')) {
      // Retry without the optional type field if the schema does not include it.
      delete expenseRow.type
      insertResponse = await insforge.database
        .from('expenses')
        .insert([expenseRow])
        .select()

      inserted = insertResponse.data
      error = insertResponse.error
    }

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(inserted[0]), {
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
      return new Response(JSON.stringify({ error: 'Missing expense ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { error } = await insforge.database
      .from('expenses')
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
