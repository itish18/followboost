export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { ClientList } from "@/components/dashboard/client-list";

export default async function ClientsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
          <p className="text-muted-foreground">
            Manage your clients and their contact information.
          </p>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/clients/new"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>
      <ClientList clients={clients ?? []} />
    </div>
  );
}
