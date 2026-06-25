import { createAdminClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://376pmed2.ap-southeast.insforge.app';

const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || 'ik_fd319524a5e7923aca5217024108b3d7';

export const insforge = createAdminClient({
  baseUrl,
  apiKey: serviceRoleKey,
  timeout: 8000,
  retryCount: 1,
  fetch: (url, options) => fetch(url, options),
});
