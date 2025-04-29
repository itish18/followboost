import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FollowupList } from "@/components/dashboard/followup-list";
import Link from "next/link";

export default function FollowupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Follow-ups</h2>
          <p className="text-muted-foreground">
            Manage your email follow-ups and communications.
          </p>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/followups/new"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Follow-up
          </Link>
        </Button>
      </div>
      <FollowupList />
    </div>
  );
}
