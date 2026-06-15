'use server'

import { insforge } from '../../../lib/insforge'

export async function POST(request) {
    try {
        const data = await request.json()

        // Validate required fields
        const { name, email, phone, message } = data
        if (!name || !email || !phone || !message) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
        }

        const { data: records, error } = await insforge.database
            .from('contacts')
            .insert([
                {
                    name,
                    email,
                    phone,
                    message,
                    source: 'website-contact-form'
                }
            ])
            .select()

        if (error) {
            return new Response(JSON.stringify({ error: 'InsForge DB error', details: error.message }), { status: 502 })
        }

        return new Response(JSON.stringify({ success: true, insforge: records }), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 })
    }
}

