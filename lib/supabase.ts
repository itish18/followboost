import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types';

// These environment variables will be set after connecting to Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClientComponentClient<Database>()

export type Tables = Database['public']['Tables'];
export type Client = Tables['clients']['Row'];
export type Followup = Tables['followups']['Row'];
export type Profile = Tables['profiles']['Row'];