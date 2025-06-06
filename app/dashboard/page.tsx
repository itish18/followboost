import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentFollowups } from "@/components/dashboard/recent-followups";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getRecentFollowups() {
  const supabase = createServerComponentClient({ cookies });

  const { data: followups, error } = await supabase
    .from("followups")
    .select(
      `
      id,
      subject,
      status,
      sent_at,
      scheduled_at,
      is_opened,
      clients!inner (
        id,
        full_name,
        email
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent followups:", error);
    return [];
  }

  return followups as unknown as RecentFollowupsProps["followups"];
}

async function getChartData() {
  const supabase = createServerComponentClient({ cookies });

  // Get the date range for the last 7 months
  const today = new Date();
  const sevenMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);

  const { data: followups, error } = await supabase
    .from("followups")
    .select("sent_at, is_opened")
    .eq("status", "sent")
    .gte("sent_at", sevenMonthsAgo.toISOString())
    .order("sent_at", { ascending: true });

  if (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }

  // Create a map for the last 7 months
  const monthsData = new Map<string, { sent: number; opened: number }>();

  // Initialize the last 7 months with 0 values
  for (let i = 0; i < 7; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", { month: "short" });
    monthsData.set(monthName, { sent: 0, opened: 0 });
  }

  // Count sent and opened emails for each month
  followups?.forEach((followup) => {
    const date = new Date(followup.sent_at);
    const monthName = date.toLocaleString("default", { month: "short" });

    if (monthsData.has(monthName)) {
      const currentData = monthsData.get(monthName)!;
      monthsData.set(monthName, {
        sent: currentData.sent + 1,
        opened: followup.is_opened
          ? currentData.opened + 1
          : currentData.opened,
      });
    }
  });

  // Convert map to array and reverse to show oldest to newest
  return Array.from(monthsData.entries())
    .map(([name, stats]) => ({
      name,
      sent: stats.sent,
      opened: stats.opened,
    }))
    .reverse();
}

async function getStats() {
  const supabase = createServerComponentClient({ cookies });
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Get total clients
  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact" });

  // Get clients added this month
  const { count: newClientsThisMonth } = await supabase
    .from("clients")
    .select("*", { count: "exact" })
    .gte("created_at", firstDayThisMonth.toISOString());

  // Get clients added last month
  const { count: newClientsLastMonth } = await supabase
    .from("clients")
    .select("*", { count: "exact" })
    .gte("created_at", firstDayLastMonth.toISOString())
    .lt("created_at", firstDayThisMonth.toISOString());

  // Get followups stats
  const { data: followupsThisMonth } = await supabase
    .from("followups")
    .select("id, is_opened")
    .eq("status", "sent")
    .gte("sent_at", firstDayThisMonth.toISOString());

  const { data: followupsLastMonth } = await supabase
    .from("followups")
    .select("id, is_opened")
    .eq("status", "sent")
    .gte("sent_at", firstDayLastMonth.toISOString())
    .lt("sent_at", firstDayThisMonth.toISOString());

  // Calculate open rates
  const openRateThisMonth = followupsThisMonth?.length
    ? (followupsThisMonth.filter((f) => f.is_opened).length /
        followupsThisMonth.length) *
      100
    : 0;

  const openRateLastMonth = followupsLastMonth?.length
    ? (followupsLastMonth.filter((f) => f.is_opened).length /
        followupsLastMonth.length) *
      100
    : 0;

  return {
    clients: {
      total: totalClients || 0,
      change: (newClientsThisMonth || 0) - (newClientsLastMonth || 0),
    },
    followups: {
      total: followupsThisMonth?.length || 0,
      change:
        (followupsThisMonth?.length || 0) - (followupsLastMonth?.length || 0),
    },
    openRate: {
      current: Math.round(openRateThisMonth),
      change: Math.round(openRateThisMonth - openRateLastMonth),
    },
  };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const chartData = await getChartData();
  const recentFollowups = await getRecentFollowups();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your client follow-ups and activity.
          </p>
        </div>
        <Button asChild>
          <Link
            href="/dashboard/followups/new"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Follow-up
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clients.total}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stats.clients.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(stats.clients.change)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Follow-ups Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.followups.total}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stats.followups.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(stats.followups.change)} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.openRate.current}%
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stats.openRate.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(stats.openRate.change)}% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Follow-up Activity</CardTitle>
                <CardDescription>
                  Follow-up emails sent and opened over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={chartData} />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Follow-ups</CardTitle>
                  <CardDescription>
                    Your most recent follow-up emails
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    href="/dashboard/followups"
                    className="flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <RecentFollowups followups={recentFollowups} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed analytics will be available in the full version.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
              Advanced analytics coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
