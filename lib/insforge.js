import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.INSFORGE_SERVICE_ROLE_KEY // Use the service role key on the backend (API routes) to bypass RLS policies
});
