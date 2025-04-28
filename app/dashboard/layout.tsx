import { CheckAuth } from "@/components/auth/check-auth";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CheckAuth>
      <div className="flex min-h-screen flex-col px-6">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <Mail className="h-6 w-6 text-primary" />
              <span>FollowBoost</span>
            </Link>
            <UserNav />
          </div>
        </header>
        <div className="flex-1 container grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 py-6">
          <DashboardNav className="hidden md:block" />
          <main>{children}</main>
        </div>
      </div>
    </CheckAuth>
  );
}
