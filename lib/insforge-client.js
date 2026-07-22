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
  storage: {
    ..._client.storage,
    from: (bucketName) => {
      const bucket = _client.storage.from(bucketName);
      return {
        ...bucket,
        remove: async (paths) => {
          const formattedPaths = Array.isArray(paths) ? paths : [paths];
          return bucket.remove(formattedPaths);
        },
        uploadAuto: async (file) => {
          // Generate a unique path/key
          const key = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
          const { data, error } = await bucket.upload(key, file);
          if (error) {
            return { data: null, error };
          }
          // Get public URL
          const { data: publicUrlData } = bucket.getPublicUrl(key);
          return {
            data: {
              url: publicUrlData?.publicUrl || '',
              key: key
            },
            error: null
          };
        }
      };
    }
  },
  auth: {
    ..._client.auth,
    getCurrentUser: async () => {
      const res = await _client.auth.getUser();
      // If we don't have currentAccessToken, try retrieving it from the active session
      if (!currentAccessToken) {
        const { data: sessionData } = await _client.auth.getSession();
        if (sessionData?.session) {
          currentAccessToken = sessionData.session.access_token;
        }
      }
      return res;
    },
    signInWithPassword: async (credentials) => {
      const res = await _client.auth.signInWithPassword(credentials);
      if (res.data?.session) {
        res.data.accessToken = res.data.session.access_token;
        currentAccessToken = res.data.session.access_token;
      }
      return res;
    },
    tokenManager: {
      getAccessToken: () => {
        if (!currentAccessToken && typeof window !== 'undefined') {
          currentAccessToken = window.localStorage.getItem('hayagriva_admin_access_token');
        }
        return currentAccessToken;
      }
    }
  }
};
