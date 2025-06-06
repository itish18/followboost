"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmailSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: false,
    openTracking: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({ title: "Email preferences updated" });
    } catch (error) {
      toast({
        title: "Failed to update email preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage your email notifications and tracking preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about your follow-ups
            </p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, emailNotifications: checked }))
            }
            disabled={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Open Tracking</Label>
            <p className="text-sm text-muted-foreground">
              Track when your follow-ups are opened
            </p>
          </div>
          <Switch
            checked={settings.openTracking}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, openTracking: checked }))
            }
            disabled={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">
              Receive a weekly summary of your follow-up activity
            </p>
          </div>
          <Switch
            checked={settings.weeklyDigest}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, weeklyDigest: checked }))
            }
            disabled={true}
          />
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
