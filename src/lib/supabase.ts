import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseEnvErrorMessage =
  'Missing Supabase environment variables. Check .env.local and restart the dev server.';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(`[Supabase] ${supabaseEnvErrorMessage}`);
}

type SupabaseClient = ReturnType<typeof createClient>;

const createSupabaseConfigError = () => {
  const error = new Error(supabaseEnvErrorMessage);
  error.name = 'SupabaseConfigurationError';
  return error;
};

const supabaseFallback = new Proxy(
  {},
  {
    get() {
      throw createSupabaseConfigError();
    },
  }
) as SupabaseClient;

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : supabaseFallback;

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Idea {
  id: string;
  title: string;
  brief: string;
  description: string;
  tag: string;
  github_url?: string;
  owner_id: string;
  owner?: User;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  idea_id: string;
  author_id: string;
  author?: User;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  idea_id: string;
  created_at: string;
}
