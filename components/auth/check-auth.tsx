"use client";

import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const CheckAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (pathname === "/authenticate") {
          router.replace("/dashboard");
        }
      } else {
        router.replace("/authenticate");
      }
    });
  }, [router, pathname]);

  return <>{children}</>;
};
