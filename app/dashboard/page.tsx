export const dynamic = "force-dynamic"
export const revalidate = 0

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp, ClipboardCheck } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: classroom, error: classroomError } = await supabase
    .from("classrooms")
    .select("*")
    .eq("teacher_id", user.id)
    .maybeSingle()

  if (classroomError || !classroom) {
    redirect("/setup")
  }

  const { count: totalStudents, error: studentsError } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", classroom.id)

  const today = new Date().toISOString().split("T")[0]

  const { data: students, error: studentsListError } = await supabase
    .from("students")
    .select("id")
    .eq("classroom_id", classroom.id)

  // Only query attendance if there are students
  let presentToday = 0
  if (students && students.length > 0 && !studentsListError) {
    const { count, error: attendanceError } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("date", today)
      .eq("status", "present")
      .in(
        "student_id",
        students.map((s) => s.id),
      )

    if (!attendanceError) {
      presentToday = count || 0
    }
  }

  const { count: totalAssignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", classroom.id)

  const attendanceRate = totalStudents && presentToday ? Math.round((presentToday / totalStudents) * 100) : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your classroom today.</p>
        </div>
        <Link href="/dashboard/attendance">
          <Button size="lg" className="gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Take Attendance
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={String(totalStudents || 0)}
          change="+0 from last month"
          icon={Users}
          index={0}
        />
        <StatCard
          title="Present Today"
          value={String(presentToday || 0)}
          change={`${attendanceRate}% attendance rate`}
          icon={Calendar}
          index={1}
        />
        <StatCard
          title="Assignments"
          value={String(totalAssignments || 0)}
          change="+0 from last month"
          icon={FileText}
          index={2}
        />
        <StatCard title="Class Average" value="--" change="Across all assignments" icon={TrendingUp} index={3} />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle>Classroom Information</CardTitle>
          <CardDescription>Your classroom details and settings</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Classroom Name</p>
              <p className="text-xl font-semibold">{classroom.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
              <p className="text-xl font-semibold">{classroom.grade_level}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-xl font-semibold">{classroom.academic_year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your classroom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Attendance taken for today</p>
                <p className="text-sm text-muted-foreground">{presentToday || 0} students marked present</p>
              </div>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
