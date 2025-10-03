import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: classroom } = await supabase.from("classrooms").select("*").eq("teacher_id", user.id).maybeSingle()

  if (!classroom) {
    redirect("/setup")
  }

  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", classroom.id)

  const today = new Date().toISOString().split("T")[0]
  const { data: students } = await supabase.from("students").select("id").eq("classroom_id", classroom.id)

  const { count: presentToday } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("date", today)
    .eq("status", "present")
    .in("student_id", students?.map((s) => s.id) || [])

  const { count: totalAssignments } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", classroom.id)

  const attendanceRate = totalStudents && presentToday ? Math.round((presentToday / totalStudents) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your classroom today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled in your class</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentToday || 0}</div>
            <p className="text-xs text-muted-foreground">{attendanceRate}% attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments || 0}</div>
            <p className="text-xs text-muted-foreground">Total created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Across all assignments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classroom Information</CardTitle>
          <CardDescription>Your classroom details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classroom Name</p>
              <p className="text-lg font-semibold">{classroom.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
              <p className="text-lg font-semibold">{classroom.grade_level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-lg font-semibold">{classroom.academic_year}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
