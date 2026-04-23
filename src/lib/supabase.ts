import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
