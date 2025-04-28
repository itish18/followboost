"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Mail, 
  Settings, 
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname();
  
  const items = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Follow-ups",
      href: "/dashboard/followups",
      icon: <Mail className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className={cn("space-y-2", className)}>
      {items.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            pathname === item.href
              ? "bg-secondary"
              : "hover:bg-transparent hover:underline"
          )}
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[280px]">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl mb-6">
          <Mail className="h-6 w-6 text-primary" />
          <span>FollowBoost</span>
        </Link>
        <DashboardNav />
      </SheetContent>
    </Sheet>
  );
}