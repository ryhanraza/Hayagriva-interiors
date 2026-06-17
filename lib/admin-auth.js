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

    userClient = createServerClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
      accessToken: token,
    });
  } else {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookieHeader(cookieHeader);

    userClient = createServerClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
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
