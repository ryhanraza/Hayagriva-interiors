import { insforgeClient } from '../../../../lib/insforge-client';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const allowedPassword = process.env.ADMIN_PASSWORD;
        if (!allowedPassword) {
            return new Response(JSON.stringify({ error: 'Server configuration error: ADMIN_PASSWORD is not set.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const allowedEmails = ['interiorsbyhayagriva@gmail.com', 'interiorsbyhayagriya@gmail.com'];
        const enteredEmail = email?.toLowerCase().trim();
        // Only allow creating the specific admin user
        if (!enteredEmail || !allowedEmails.includes(enteredEmail) || password !== allowedPassword) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if user already exists by trying to sign in
        const { data: signInData, error: signInError } = await insforgeClient.auth.signInWithPassword({
            email,
            password
        });

        if (!signInError && signInData?.user) {
            return new Response(JSON.stringify({
                success: true,
                message: 'User already exists',
                user: signInData.user
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Try to sign up
        const { data, error } = await insforgeClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard`
            }
        });

        if (error) {
            // User might already exist
            return new Response(JSON.stringify({
                error: error.message,
                code: error.code
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'User created successfully',
            user: data.user,
            session: data.session
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
