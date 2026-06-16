'use server'

import { insforge } from '../../../lib/insforge'

export async function POST(request) {
    try {
        const data = await request.json()

        // Validate required fields (Name and Phone are mandatory)
        const { name, email, phone, message } = data
        if (!name || !phone) {
            return new Response(JSON.stringify({ error: 'Missing name or phone number' }), { status: 400 })
        }

        const finalEmail = email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lead'}@quickcontact.com`
        const finalMessage = message || 'Quick Consultation Lead (Name + Phone only)'
        const finalSource = email && message ? 'website-contact-form' : 'website-hero-quick-lead'

        const { data: records, error } = await insforge.database
            .from('contacts')
            .insert([
                {
                    name,
                    email: finalEmail,
                    phone,
                    message: finalMessage,
                    source: finalSource
                }
            ])
            .select()

        if (error) {
            console.error("InsForge DB insert error details:", error)
            const keys = Object.getOwnPropertyNames(error)
            const details = keys.length > 0 
                ? keys.map(k => `${k}: ${typeof error[k] === 'object' ? JSON.stringify(error[k]) : error[k]}`).join(' | ')
                : String(error)
            return new Response(JSON.stringify({ 
                error: 'InsForge DB error', 
                details: details,
                keys: keys
            }), { status: 502 })
        }

        return new Response(JSON.stringify({ success: true, insforge: records }), { status: 200 })
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 })
    }
}

