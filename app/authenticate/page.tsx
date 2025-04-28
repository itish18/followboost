import { AuthTabs } from "@/components/auth/auth-tabs";
import { CheckAuth } from "@/components/auth/check-auth";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  return (
    <CheckAuth>
      <div className="min-h-screen flex flex-col">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Mail className="h-6 w-6 text-primary" />
            <span>FollowBoost</span>
          </Link>
        </div>

        <div className="flex-1 container flex flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <AuthTabs />
          </div>
        </div>
      </div>
    </CheckAuth>
  );
}
