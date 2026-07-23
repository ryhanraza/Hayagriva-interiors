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
  storage: new Proxy(_adminClient.storage, {
    get(target, prop, receiver) {
      if (prop === 'from') {
        return (bucketName) => {
          const bucket = target.from(bucketName);
          return new Proxy(bucket, {
            get(subTarget, subProp, subReceiver) {
              if (subProp === 'remove') {
                return async (paths) => {
                  const formattedPaths = Array.isArray(paths) ? paths : [paths];
                  return subTarget.remove(formattedPaths);
                };
              }
              const val = Reflect.get(subTarget, subProp, subReceiver);
              return typeof val === 'function' ? val.bind(subTarget) : val;
            }
          });
        };
      }
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    }
  }),
  auth: _adminClient.auth,
};
