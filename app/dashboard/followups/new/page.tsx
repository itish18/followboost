import { FollowupForm } from "@/components/dashboard/followup-form";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function NewFollowupPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: clients, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error("Error fetching clients:", error);
    return <div>Error loading clients</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Create Follow-up Email
        </h2>
        <p className="text-muted-foreground">
          Generate an AI-powered follow-up email based on your meeting context.
        </p>
      </div>

      <FollowupForm clients={clients} initialData={null} />
    </div>
  );
}
