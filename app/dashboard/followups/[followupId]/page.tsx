// app/dashboard/followups/[followupId]/page.tsx
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
import { ArrowLeft, Clock, Edit, Eye, Mail, Send } from "lucide-react";
import { utcToLocal } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function FollowupPage({
  params,
}: {
  params: { followupId: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch followup with client details
  const { data: followup, error } = await supabase
    .from("followups")
    .select(
      `
      *,
      clients (
        id,
        full_name,
        email,
        company
      )
    `
    )
    .eq("id", params.followupId)
    .single();

  if (error || !followup) {
    notFound();
  }

  const getStatusDisplay = () => {
    switch (followup.status) {
      case "sent":
        return {
          label: followup.is_opened ? "Opened" : "Sent",
          variant: followup.is_opened ? "default" : "secondary",
          icon: followup.is_opened ? Eye : Mail,
        };
      case "scheduled":
        return {
          label: "Scheduled",
          variant: "outline",
          icon: Clock,
        };
      default:
        return {
          label: followup.status,
          variant: "secondary",
          icon: Mail,
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/followups"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Follow-ups
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            {followup.subject}
          </h2>
          <div className="flex items-center gap-2">
            <Badge
              variant={status.variant as "default" | "secondary" | "outline"}
              className="flex items-center gap-1"
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            {followup.status === "sent" && (
              <span className="text-sm text-muted-foreground">
                Sent on{" "}
                {format(utcToLocal(followup.sent_at!).localDate, "PPP 'at' p")}
              </span>
            )}
            {followup.status === "scheduled" && (
              <span className="text-sm text-muted-foreground">
                Scheduled for{" "}
                {format(
                  utcToLocal(followup.scheduled_at!).localDate,
                  "PPP 'at' p"
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {followup.status === "sent" ? (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/followups/${followup.id}/edit`}>
                <Send className="h-4 w-4 mr-2" />
                Resend
              </Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/followups/${followup.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Email Content */}
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>
                The content of your follow-up email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="space-y-4 text-sm">
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground">To:</div>
                    <div>{followup.clients.email}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground">
                      Subject:
                    </div>
                    <div>{followup.subject}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-muted-foreground">
                      Body:
                    </div>
                    <div className="whitespace-pre-wrap">{followup.body}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>
                Track the status of your follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        utcToLocal(followup.created_at).localDate,
                        "PPP 'at' p"
                      )}
                    </p>
                  </div>
                </div>
                {followup.status === "sent" && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Send className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sent</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            utcToLocal(followup.sent_at!).localDate,
                            "PPP 'at' p"
                          )}
                        </p>
                      </div>
                    </div>
                    {followup.is_opened && (
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Opened</p>
                          {/* <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(followup.opened_at!),
                              "PPP 'at' p"
                            )}
                          </p> */}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {followup.clients.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{followup.clients.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {followup.clients.email}
                  </p>
                </div>
              </div>
              {followup.clients.company && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Company: </span>
                  {followup.clients.company}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/dashboard/clients/${followup.clients.id}`}>
                  View Client Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Email Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Email Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={
                      status.variant as "default" | "secondary" | "outline"
                    }
                    className="mt-1.5"
                  >
                    {status.label}
                  </Badge>
                </div>
                {followup.status === "sent" && (
                  <div>
                    <p className="text-sm font-medium">Opened</p>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {followup.is_opened ? "Yes" : "No"}
                    </p>
                  </div>
                )}
                {followup.status === "scheduled" && (
                  <div>
                    <p className="text-sm font-medium">Scheduled For</p>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {format(
                        utcToLocal(followup.scheduled_at!).localDate,
                        "PPP 'at' p"
                      )}
                    </p>
                  </div>
                )}
                {followup.status === "draft" && (
                  <div>
                    <p className="text-sm font-medium">Save as draft</p>
                    {/* <p className="text-sm text-muted-foreground mt-1.5">
                      {format(
                        utcToLocal(followup.scheduled_at!).localDate,
                        "PPP 'at' p"
                      )}
                    </p> */}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
