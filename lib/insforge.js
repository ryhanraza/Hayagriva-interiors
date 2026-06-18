import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app';

const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || 'ik_fd319524a5e7923aca5217024108b3d7';

export const insforge = createClient({
  baseUrl,
  anonKey: serviceRoleKey // Use the service role key on the backend (API routes) to bypass RLS policies
});
