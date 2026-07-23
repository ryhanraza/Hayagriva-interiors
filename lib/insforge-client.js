import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vzafcqropxwujuppnkli.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const _client = createClient(supabaseUrl, anonKey);

let currentAccessToken = null;

// Listen to auth state changes to keep track of the current token in memory
if (typeof window !== 'undefined') {
  _client.auth.onAuthStateChange((event, session) => {
    currentAccessToken = session?.access_token || null;
  });
}

// Wrapper preserving the InsForge API shape used across the codebase
export const insforgeClient = {
  database: _client,
  setAccessToken: (token) => {
    currentAccessToken = token;
    _client.auth.setSession({ access_token: token, refresh_token: '' }).catch(() => {});
  },
  storage: new Proxy(_client.storage, {
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
              if (subProp === 'uploadAuto') {
                return async (file) => {
                  // Generate a unique path/key
                  const key = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
                  const { data, error } = await subTarget.upload(key, file);
                  if (error) {
                    return { data: null, error };
                  }
                  // Get public URL
                  const { data: publicUrlData } = subTarget.getPublicUrl(key);
                  return {
                    data: {
                      url: publicUrlData?.publicUrl || '',
                      key: key
                    },
                    error: null
                  };
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
  auth: new Proxy(_client.auth, {
    get(target, prop, receiver) {
      if (prop === 'getCurrentUser') {
        return async () => {
          const res = await target.getUser();
          if (!currentAccessToken) {
            const { data: sessionData } = await target.getSession();
            if (sessionData?.session) {
              currentAccessToken = sessionData.session.access_token;
            }
          }
          return res;
        };
      }
      if (prop === 'signInWithPassword') {
        return async (credentials) => {
          const res = await target.signInWithPassword(credentials);
          if (res.data?.session) {
            res.data.accessToken = res.data.session.access_token;
            currentAccessToken = res.data.session.access_token;
          }
          return res;
        };
      }
      if (prop === 'tokenManager') {
        return {
          getAccessToken: () => {
            if (!currentAccessToken && typeof window !== 'undefined') {
              currentAccessToken = window.localStorage.getItem('hayagriva_admin_access_token');
            }
            return currentAccessToken;
          }
        };
      }
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    }
  })
};
