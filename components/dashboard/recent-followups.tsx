// components/dashboard/recent-followups.tsx
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { utcToLocal } from "@/lib/utils";

export function RecentFollowups({ followups }: RecentFollowupsProps) {
  const getStatusDisplay = (followup: RecentFollowupsProps["followups"][0]) => {
    if (followup.status === "sent") {
      return {
        label: followup.is_opened ? "Opened" : "Sent",
        variant: followup.is_opened ? "default" : "secondary",
        icon: followup.is_opened ? Eye : Mail,
      };
    }
    if (followup.status === "scheduled") {
      return {
        label: "Scheduled",
        variant: "outline",
        icon: Clock,
      };
    }
    return {
      label: followup.status,
      variant: "secondary",
      icon: Mail,
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getRelevantDate = (followup: RecentFollowupsProps["followups"][0]) => {
    if (followup.sent_at) {
      return utcToLocal(followup.sent_at).localDate;
    }
    if (followup.scheduled_at) {
      return utcToLocal(followup.scheduled_at).localDate;
    }
    return new Date();
  };

  return (
    <div className="space-y-4">
      {followups.map((followup) => {
        const status = getStatusDisplay(followup);
        const StatusIcon = status.icon;

        return (
          <div
            key={followup.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {getInitials(followup.clients.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium leading-none">
                  {followup.clients.full_name}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-3 w-3" />
                  <span>{followup.subject}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={status.variant as "default" | "secondary" | "outline"}
                className="flex items-center gap-1"
              >
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(getRelevantDate(followup), {
                  addSuffix: true,
                })}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/followups/${followup.id}`}>
                      View details
                    </Link>
                  </DropdownMenuItem>
                  {followup.status === "sent" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/followups/${followup.id}/edit`}>
                        Resend
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
      {followups.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No recent follow-ups
        </div>
      )}
    </div>
  );
}
