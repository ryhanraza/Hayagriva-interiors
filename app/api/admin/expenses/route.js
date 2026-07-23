import { insforge } from '../../../../lib/insforge'
import { verifyAdmin } from '../../../../lib/admin-auth'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const dataDir = path.join(process.cwd(), 'data')
const expensesFile = path.join(dataDir, 'expenses.json')

function ensureLocalFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(expensesFile)) {
    fs.writeFileSync(expensesFile, JSON.stringify([], null, 2), 'utf8')
  }
}

function getLocalExpenses() {
  ensureLocalFile()
  try {
    const raw = fs.readFileSync(expensesFile, 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveLocalExpenses(list) {
  ensureLocalFile()
  fs.writeFileSync(expensesFile, JSON.stringify(list, null, 2), 'utf8')
}

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
      // Fallback to local store if table doesn't exist yet in Supabase
      const localList = getLocalExpenses()
      return new Response(JSON.stringify(localList), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(expenses || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    const localList = getLocalExpenses()
    return new Response(JSON.stringify(localList), {
      status: 200,
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
      id: crypto.randomUUID(),
      amount: amountValue,
      category: category.trim(),
      description: description.trim(),
      date: expenseDate,
      type: allowedType,
      user_id: auth.user?.id || null,
      created_at: new Date().toISOString()
    }

    // Try Supabase first
    const { data: inserted, error } = await insforge.database
      .from('expenses')
      .insert([expenseRow])
      .select()

    if (error) {
      // Fallback to local JSON file persistence
      const localList = getLocalExpenses()
      localList.unshift(expenseRow)
      saveLocalExpenses(localList)

      return new Response(JSON.stringify(expenseRow), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(inserted[0] || expenseRow), {
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

    // Always clean up local JSON file too
    const localList = getLocalExpenses().filter(item => item.id !== id)
    saveLocalExpenses(localList)

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
