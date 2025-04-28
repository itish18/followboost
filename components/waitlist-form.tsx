"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName("");
      setEmail("");
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">You're on the list!</h3>
        <p className="text-muted-foreground">We'll notify you as soon as FollowBoost is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          placeholder="John Smith" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="john@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join the Waitlist"}
      </Button>
    </form>
  );
}