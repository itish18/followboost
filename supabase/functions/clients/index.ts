import { supabase } from "@/lib/supabase";


// Fetch all clients
export async function fetchClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data??[];
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();  

    console.log("Supabase response:", { data, error });

  if (error) throw new Error(error.message);
  if (!data) return null;  
  return data;
}

// Create a new client
export async function createClient(clientData: {
  user_id:string;
  full_name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData as any])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Update client
export async function updateClient(id: string, updates: Partial<{
  full_name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
}>) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Delete client
export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
 
}
