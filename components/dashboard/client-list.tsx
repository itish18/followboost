"use client";

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
import { MoreHorizontal, Search, Mail } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function ClientList({ clients }: { clients: Client[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter(
    (client) =>
      client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <CardDescription>
          Manage your client relationships and follow-up communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                {/* <TableHead className="hidden md:table-cell">
                  Last Contacted
                </TableHead> */}
                {/* <TableHead className="hidden md:table-cell">Status</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {client?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{client.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.company}
                  </TableCell>
                  {/* <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(client.lastContacted, {
                      addSuffix: true,
                    })}
                  </TableCell> */}
                  {/* <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        client.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell> */}
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
                          <Link href={`/dashboard/clients/${client.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/clients/${client.id}/edit`}>
                            Edit Client
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/followups/new?client=${client.id}`}
                            className="flex items-center"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Follow-up
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No clients found.
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
