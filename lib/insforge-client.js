import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const _client = createClient(supabaseUrl, anonKey);

// Wrapper preserving the InsForge API shape used across the codebase
export const insforgeClient = {
  database: _client,
  storage: _client.storage,
  auth: _client.auth,
};
