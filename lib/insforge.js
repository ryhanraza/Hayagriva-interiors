import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const _adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Wrapper preserving the InsForge API shape used across all API routes:
// insforge.database.from('table') → _adminClient.from('table')
// insforge.storage.from('bucket') → _adminClient.storage.from('bucket')
export const insforge = {
  database: _adminClient,
  storage: _adminClient.storage,
  auth: _adminClient.auth,
};
