import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app';

export const insforge = createClient({
  baseUrl,
  anonKey: process.env.INSFORGE_SERVICE_ROLE_KEY // Use the service role key on the backend (API routes) to bypass RLS policies
});
