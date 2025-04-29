"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Search, Eye, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { formatInTimeZone, format } from "date-fns-tz";
import Link from "next/link";

export function FollowupList({ followups }: { followups: Followup[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFollowups = followups.filter(
    (followup) =>
      followup.clients?.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      followup.clients?.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      followup.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusDisplay = (status: string, followup: Followup) => {
    switch (status) {
      case "sent":
        const sentDate = new Date(followup.sent_at!);

        const localSentDate = new Date(
          sentDate.getTime() - sentDate.getTimezoneOffset() * 60000
        );

        return (
          <Badge variant="secondary">
            Sent{" "}
            {formatDistanceToNow(localSentDate, {
              addSuffix: true,
            })}
          </Badge>
        );
      case "opened":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Opened {followup.is_opened ? "Yes" : "No"}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 max-w-fit px-4"
          >
            <Clock className="h-3 w-3" />
            Scheduled for{" "}
            {format(
              followup.scheduled_at
                ? new Date(followup.scheduled_at)
                : new Date(),
              "dd-MM-yyyy HH:mm a",
              { timeZone: "America/New_York" }
            )}
          </Badge>
        );
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Emails</CardTitle>
        <CardDescription>
          All your sent, scheduled, and draft follow-up communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search follow-ups..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFollowups.map((followup) => (
                <TableRow key={followup.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {followup.clients?.full_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {followup.clients?.full_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {followup.clients?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{followup.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getStatusDisplay(followup.status, followup)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/followups/${followup.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/followups/${followup.id}/edit`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {followup.status === "draft" && (
                          <DropdownMenuItem>Send Now</DropdownMenuItem>
                        )}
                        {followup.status === "sent" && (
                          <DropdownMenuItem>Resend</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFollowups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No follow-ups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
