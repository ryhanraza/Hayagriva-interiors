import { createClient } from '@insforge/sdk';

export async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized: Missing token', status: 401 };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { error: 'Unauthorized: Empty token', status: 401 };
  }

  try {
    const userClient = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: token,
    });

    const { data, error } = await userClient.auth.getCurrentUser();
    if (error || !data?.user) {
      return { error: 'Unauthorized: Invalid token', status: 401 };
    }

    // Restrict access to registered admin emails
    const allowedAdminEmails = ['admin@example.com', '22rayyanraza@gmail.com'];
    if (!allowedAdminEmails.includes(data.user.email)) {
      return { error: 'Forbidden: Access denied', status: 403 };
    }

    return { user: data.user };
  } catch (err) {
    return { error: 'Unauthorized: Verification failed: ' + err.message, status: 401 };
  }
}
