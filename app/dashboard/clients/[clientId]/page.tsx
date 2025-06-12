export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Mail, Edit, Trash2, Send, Eye } from "lucide-react";
import { utcToLocal } from "@/lib/utils";

export default async function ClientPage({
  params,
}: {
  params: { clientId: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch client details
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", params.clientId)
    .single();

  if (!client) {
    notFound();
  }

  // Fetch follow-ups for this client
  const { data: followups } = await supabase
    .from("followups")
    .select("*")
    .eq("client_id", params.clientId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Client Details</h2>
          <p className="text-muted-foreground">
            View and manage client information and follow-ups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/clients/${params.clientId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/followups/new?client=${params.clientId}`}>
              <Mail className="h-4 w-4 mr-2" />
              New Follow-up
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🧍 Client Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{client.full_name}</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{client.email}</span>
            </div>
            {client.phone && (
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{client.phone}</span>
              </div>
            )}
            {client.company && (
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{client.company}</span>
              </div>
            )}
            {client.notes && (
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground">Notes</span>
                <span className="font-medium whitespace-pre-wrap">
                  {client.notes}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-up History Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📬 Follow-up History</span>
            </CardTitle>
            <CardDescription>
              Track all follow-up emails sent to this client
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {followups && followups.length > 0 ? (
              followups.map((followup) => (
                <div
                  key={followup.id}
                  className="flex flex-col space-y-2 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{followup.subject}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge
                          variant={
                            followup.status === "sent"
                              ? followup.is_opened
                                ? "default"
                                : "default"
                              : "secondary"
                          }
                        >
                          {followup.status === "sent"
                            ? followup.is_opened
                              ? "Opened"
                              : "Sent"
                            : "Scheduled"}
                        </Badge>
                        {followup.status === "sent" ? (
                          <span>
                            Sent:{" "}
                            {format(
                              utcToLocal(followup.sent_at).localDate,
                              "PP"
                            )}
                          </span>
                        ) : (
                          <span>
                            Scheduled:{" "}
                            {format(
                              utcToLocal(followup.scheduled_at).localDate,
                              "PP p"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {followup.status === "sent" ? (
                        <>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/dashboard/followups/${followup.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Send className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" asChild>
                            <Link
                              href={`/dashboard/followups/${followup.id}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No follow-ups yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
