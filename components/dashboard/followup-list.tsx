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
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

// Mock follow-up data
const followups = [
  {
    id: "1",
    client: {
      name: "Alex Johnson",
      email: "alex@acme.com",
      initials: "AJ",
    },
    subject: "Follow-up on our product demo",
    status: "sent",
    sentDate: new Date("2025-03-29T14:30:00"),
    openDate: new Date("2025-03-29T15:45:00"),
    scheduledDate: null,
  },
  {
    id: "2",
    client: {
      name: "Samantha Williams",
      email: "samantha@globex.com",
      initials: "SW",
    },
    subject: "Next steps after our meeting",
    status: "opened",
    sentDate: new Date("2025-03-25T11:15:00"),
    openDate: new Date("2025-03-25T13:20:00"),
    scheduledDate: null,
  },
  {
    id: "3",
    client: {
      name: "David Miller",
      email: "david@universalexports.com",
      initials: "DM",
    },
    subject: "Proposal for your review",
    status: "scheduled",
    sentDate: null,
    openDate: null,
    scheduledDate: new Date("2025-04-05T09:00:00"),
  },
  {
    id: "4",
    client: {
      name: "Jessica Chen",
      email: "jessica@soylentcorp.com",
      initials: "JC",
    },
    subject: "Product update and new features",
    status: "sent",
    sentDate: new Date("2025-03-20T16:20:00"),
    openDate: null,
    scheduledDate: null,
  },
  {
    id: "5",
    client: {
      name: "Michael Rodriguez",
      email: "michael@umbrellacorp.com",
      initials: "MR",
    },
    subject: "Quarterly review meeting",
    status: "draft",
    sentDate: null,
    openDate: null,
    scheduledDate: null,
  },
];

export function FollowupList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFollowups = followups.filter(
    (followup) =>
      followup.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followup.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followup.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusDisplay = (status: string, followup: (typeof followups)[0]) => {
    switch (status) {
      case "sent":
        return (
          <Badge variant="secondary">
            Sent {formatDistanceToNow(followup.sentDate!, { addSuffix: true })}
          </Badge>
        );
      case "opened":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Opened {formatDistanceToNow(followup.openDate!, { addSuffix: true })}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Scheduled for {format(followup.scheduledDate!, "MMM d, h:mm a")}
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
                        <AvatarFallback>{followup.client.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{followup.client.name}</div>
                        <div className="text-xs text-muted-foreground">{followup.client.email}</div>
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
                          <Link href={`/dashboard/followups/${followup.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/followups/${followup.id}/edit`}>Edit</Link>
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