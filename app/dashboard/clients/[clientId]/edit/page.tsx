export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ClientForm } from "@/components/dashboard/client-form";

export default async function EditClientPage({
  params,
}: {
  params: { clientId: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params?.clientId)
    .maybeSingle();

  if (error || !client) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      <ClientForm initialData={client} clientId={params.clientId} />
    </div>
  );
}
