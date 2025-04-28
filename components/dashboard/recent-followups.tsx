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
import { MoreHorizontal, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const recentFollowups = [
  {
    id: "1",
    client: "Sara Wilson",
    email: "sara@acme.com",
    subject: "Follow-up on our product demo",
    status: "sent",
    date: new Date("2025-04-01T10:00:00"),
    initials: "SW",
  },
  {
    id: "2",
    client: "Michael Johnson",
    email: "michael@globex.com",
    subject: "Next steps after our meeting",
    status: "opened",
    date: new Date("2025-03-28T15:30:00"),
    initials: "MJ",
  },
  {
    id: "3",
    client: "Emily Davis",
    email: "emily@universalexports.com",
    subject: "Proposal for your review",
    status: "scheduled",
    date: new Date("2025-04-05T09:00:00"),
    initials: "ED",
  },
];

export function RecentFollowups() {
  return (
    <div className="space-y-4">
      {recentFollowups.map((followup) => (
        <div
          key={followup.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{followup.initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium leading-none">{followup.client}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-3 w-3" />
                <span>{followup.subject}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                followup.status === "opened"
                  ? "default"
                  : followup.status === "sent"
                  ? "secondary"
                  : "outline"
              }
            >
              {followup.status}
            </Badge>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(followup.date, { addSuffix: true })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Resend</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}