import { supabase } from "@/lib/supabase";
import { Database } from '@/lib/database.types';
type Followup = Database['public']['Tables']['followups']['Insert'];

export async function createFollowup(followupData:Followup) {
  const { data, error } = await supabase
    .from("followups")
    .insert(followupData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
