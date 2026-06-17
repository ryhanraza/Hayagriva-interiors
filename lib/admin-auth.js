import { createClient } from '@insforge/sdk';
import { createServerClient } from '@insforge/sdk/ssr';

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
  let userClient;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return { error: 'Unauthorized: Empty token', status: 401 };
    }

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app';
    const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDk0NTl9.MwOnb93Mhneh9WlCekuZ_PF4OtQZLfcNmxbh-LgFJtQ';

    userClient = createServerClient({
      baseUrl,
      anonKey,
      accessToken: token,
    });
  } else {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookieHeader(cookieHeader);

    const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app';
    const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDk0NTl9.MwOnb93Mhneh9WlCekuZ_PF4OtQZLfcNmxbh-LgFJtQ';

    userClient = createServerClient({
      baseUrl,
      anonKey,
      cookies: {
        get(name) {
          return cookies[name];
        },
      },
    });
  }

  try {
    const { data, error } = await userClient.auth.getCurrentUser();
    if (error || !data?.user) {
      return { error: 'Unauthorized: Invalid token or session', status: 401 };
    }

    if (data.user.email !== 'interiorsbyhayagriva@gmail.com') {
      return { error: 'Forbidden: Access denied', status: 403 };
    }

    return { user: data.user };
  } catch (err) {
    return { error: 'Unauthorized: Verification failed: ' + err.message, status: 401 };
  }
}
