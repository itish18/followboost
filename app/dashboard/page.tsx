import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentFollowups } from "@/components/dashboard/recent-followups";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
          <Link href="/dashboard/followups/new" className="flex items-center gap-1">
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
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
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
                <div className="text-2xl font-bold">36</div>
                <p className="text-xs text-muted-foreground">
                  +8 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Open Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +4% from last month
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
                <Overview />
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
                  <Link href="/dashboard/followups" className="flex items-center gap-1">
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <RecentFollowups />
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