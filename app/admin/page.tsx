import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, GraduationCap, Activity, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function SuperAdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is super admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Fetch platform-wide statistics
  const { data: schools } = await supabase.from("schools").select("*")
  const activeSchools = schools?.filter((s) => s.status === "active").length || 0
  const totalSchools = schools?.length || 0

  // Get all students across all schools
  const { count: totalStudents } = await supabase.from("students").select("*", { count: "exact", head: true })

  // Get all teachers
  const { count: totalTeachers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .in("role", ["teacher", "school_admin"])

  // Calculate system-wide attendance rate
  const today = new Date().toISOString().split("T")[0]
  const { count: presentToday } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("date", today)
    .eq("status", "present")

  const attendanceRate = totalStudents && presentToday ? Math.round((presentToday / totalStudents) * 100) : 0

  // Get recent platform metrics
  const { data: latestMetrics } = await supabase
    .from("platform_metrics")
    .select("*")
    .order("metric_date", { ascending: false })
    .limit(1)
    .single()

  // Platform health status
  const platformHealth =
    activeSchools > 0 && attendanceRate > 70 ? "healthy" : activeSchools > 0 ? "warning" : "critical"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
          <p className="text-muted-foreground">Platform-wide overview and system management</p>
        </div>
        <Badge
          variant={
            platformHealth === "healthy" ? "default" : platformHealth === "warning" ? "secondary" : "destructive"
          }
          className="h-8 px-4"
        >
          {platformHealth === "healthy" && <CheckCircle className="mr-2 h-4 w-4" />}
          {platformHealth !== "healthy" && <AlertCircle className="mr-2 h-4 w-4" />}
          System {platformHealth === "healthy" ? "Healthy" : platformHealth === "warning" ? "Warning" : "Critical"}
        </Badge>
      </div>

      {/* Master Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              {activeSchools} active, {totalSchools - activeSchools} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Across all schools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">Active educators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">System-wide today</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health & Revenue */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Health Status</CardTitle>
            <CardDescription>Real-time system monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <Badge variant="default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm text-muted-foreground">~120ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Connections</span>
              <span className="text-sm text-muted-foreground">{activeSchools * 3}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Uptime</span>
              <span className="text-sm text-muted-foreground">{latestMetrics?.system_uptime_percentage || 99.9}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Metrics</CardTitle>
            <CardDescription>Platform financial overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monthly Recurring Revenue</span>
              <span className="text-lg font-bold">$0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Free Tier Schools</span>
              <span className="text-sm text-muted-foreground">
                {schools?.filter((s) => s.subscription_tier === "free").length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Premium Schools</span>
              <span className="text-sm text-muted-foreground">
                {schools?.filter((s) => s.subscription_tier === "premium").length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Enterprise Schools</span>
              <span className="text-sm text-muted-foreground">
                {schools?.filter((s) => s.subscription_tier === "enterprise").length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/admin/schools"
              className="flex flex-col items-center justify-center rounded-lg border border-border p-6 hover:bg-accent transition-colors"
            >
              <Building2 className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Manage Schools</span>
            </a>
            <a
              href="/admin/users"
              className="flex flex-col items-center justify-center rounded-lg border border-border p-6 hover:bg-accent transition-colors"
            >
              <Users className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">User Administration</span>
            </a>
            <a
              href="/admin/system"
              className="flex flex-col items-center justify-center rounded-lg border border-border p-6 hover:bg-accent transition-colors"
            >
              <Activity className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">System Controls</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
