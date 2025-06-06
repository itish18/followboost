import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
type Followup = Database["public"]["Tables"]["followups"]["Insert"];

export async function createFollowup(followupData: Followup) {
  const { data, error } = await supabase
    .from("followups")
    .insert(followupData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateFollowUp(followupData: Followup, id: string) {
  const { data, error } = await supabase
    .from("followups")
    .update(followupData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteFollowup(id: string) {
  const { error } = await supabase.from("followups").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
