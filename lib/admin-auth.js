import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_lD7hR9BKdDyl9_oAWHkLgw_to_Xsox4';

function parseCookieHeader(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const [name, ...valueParts] = item.split('=');
        return [name.trim(), decodeURIComponent(valueParts.join('=').trim())];
      })
  );
}

export async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    // Fallback: try reading from cookies
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookieHeader(cookieHeader);
    // Supabase stores session in sb-<project-ref>-auth-token cookie
    token =
      cookies['sb-vzafcqropxwujuppnkli-auth-token'] ||
      cookies['sb-access-token'] ||
      null;

    if (token) {
      try {
        token = JSON.parse(token)?.[0] ?? token;
      } catch {
        // already a raw token string
      }
    }
  }

  if (!token) {
    return { error: 'Unauthorized: No token provided', status: 401 };
  }

  const supabase = createClient(supabaseUrl, anonKey);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { error: 'Unauthorized: Invalid token or session', status: 401 };
  }

  const allowedEmails = ['interiorsbyhayagriva@gmail.com', 'interiorsbyhayagriya@gmail.com'];
  const userEmail = data.user.email?.toLowerCase().trim();
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return { error: 'Forbidden: Access denied', status: 403 };
  }

  return { user: data.user };
}
