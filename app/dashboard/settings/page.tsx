// app/dashboard/settings/page.tsx
export const dynamic = "force-dynamic";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { EmailSettings } from "@/components/dashboard/email-settings";
import { AppearanceForm } from "@/components/dashboard/appearance-form";

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm
            initialData={{
              id: user?.id,
              email: user?.email || "",
              full_name: user?.user_metadata?.full_name,
              created_at: user?.created_at,
              updated_at: user.updated_at || "",
            }}
          />
        </TabsContent>
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
