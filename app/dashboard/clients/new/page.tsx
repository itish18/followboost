"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/supabase/functions/clients";
import { supabase } from "@/lib/supabase";

export default function NewClientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const full_name = formData.get("name") as string;

    if (!email.trim() || !full_name.trim()) {
      toast({
        title: "Error",
        description: "Full Name and Email are required.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const currentUserId = await supabase.auth.getUser();

    setIsSubmitting(true);

    try {
      const { id } = await createClient({
        email: (formData.get("email") as string) ?? "",
        full_name: (formData.get("name") as string) ?? "",
        company: (formData.get("company") as string) ?? "",
        notes: (formData.get("notes") as string) ?? "",
        phone: (formData.get("phone") as string) ?? "",
        user_id: (currentUserId?.data?.user?.id as string) ?? "",
      });

      if (id) {
        toast({
          title: "Success",
          description: "Client has been created successfully.",
        });

        router.push("/dashboard/clients");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to add client",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Add New Client</h2>
        <p className="text-muted-foreground">
          Add a new client to start sending follow-ups.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>
              Enter your client&apos;s details to add them to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Smith" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                name="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input name="company" id="company" placeholder="Acme Inc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input name="phone" id="phone" placeholder="+1 (555) 123-4567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Any additional information about this client"
                name="notes"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/clients">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
