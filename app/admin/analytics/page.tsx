import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Building2 } from "lucide-react"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Fetch platform metrics for the last 30 days
  const { data: metrics } = await supabase
    .from("platform_metrics")
    .select("*")
    .order("metric_date", { ascending: false })
    .limit(30)

  // Calculate growth rates
  const latestMetric = metrics?.[0]
  const previousMetric = metrics?.[7] // 7 days ago

  const schoolGrowth =
    latestMetric && previousMetric
      ? ((latestMetric.total_schools - previousMetric.total_schools) / previousMetric.total_schools) * 100
      : 0

  const studentGrowth =
    latestMetric && previousMetric
      ? ((latestMetric.total_students - previousMetric.total_students) / previousMetric.total_students) * 100
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        <p className="text-muted-foreground">Platform growth and performance metrics</p>
      </div>

      {/* Growth Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">School Growth</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schoolGrowth > 0 ? "+" : ""}
              {schoolGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentGrowth > 0 ? "+" : ""}
              {studentGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetric?.total_teachers || 0}</div>
            <p className="text-xs text-muted-foreground">Daily active</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
          <CardDescription>Schools and students over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Chart visualization would be implemented here using Recharts
          </div>
        </CardContent>
      </Card>

      {/* School Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>School Performance Comparison</CardTitle>
          <CardDescription>Top performing schools by attendance rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Lincoln High School</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "95%" }} />
                </div>
                <span className="text-sm text-muted-foreground">95%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Washington Academy</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "92%" }} />
                </div>
                <span className="text-sm text-muted-foreground">92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Jefferson Elementary</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "89%" }} />
                </div>
                <span className="text-sm text-muted-foreground">89%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Heatmap</CardTitle>
          <CardDescription>Platform activity by day and hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Heatmap visualization would be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
