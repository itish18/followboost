export const dynamic = "force-dynamic";

import { FollowupForm } from "@/components/dashboard/followup-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function EditFollowupPage({
  params,
}: {
  params: { followupId: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  const { data: followup, error: followupError } = await supabase
    .from("followups")
    .select("*")
    .eq("id", params?.followupId)
    .maybeSingle();
  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("*");

  if (followupError || !followup) {
    console.error("Error getting followup", followupError);
    return <div>Error loading Followup</div>;
  }

  if (clientsError) {
    console.error("Error getting clients", clientsError);
    return <div>Error loading clients</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Follow-up Email
        </h2>
      </div>

      <FollowupForm clients={clients} initialData={followup} />
    </div>
  );
}
