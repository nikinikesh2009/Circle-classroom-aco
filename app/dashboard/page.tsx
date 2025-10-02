import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp, UserPlus, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/copy-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: classroom } = await supabase.from("classrooms").select("*").eq("teacher_id", user.id).single()

  if (!classroom) {
    redirect("/setup")
  }

  const { data: students, count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact" })
    .eq("classroom_id", classroom?.id)
    .order("last_name", { ascending: true })

  const today = new Date().toISOString().split("T")[0]
  const { count: presentToday } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("date", today)
    .eq("status", "present")
    .in("student_id", students?.map((s) => s.id) || [])

  const { count: totalAssignments } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("classroom_id", classroom?.id)

  const attendanceRate = totalStudents && presentToday ? Math.round((presentToday / totalStudents) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your classroom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/students/new">
              <Button className="w-full h-20 flex-col gap-2 bg-transparent" variant="outline">
                <UserPlus className="w-6 h-6" />
                <span>Add New Student</span>
              </Button>
            </Link>
            <Link href="/dashboard/attendance">
              <Button className="w-full h-20 flex-col gap-2 bg-transparent" variant="outline">
                <ClipboardCheck className="w-6 h-6" />
                <span>Take Attendance</span>
              </Button>
            </Link>
            <Link href="/dashboard/assignments/new">
              <Button className="w-full h-20 flex-col gap-2 bg-transparent" variant="outline">
                <FileText className="w-6 h-6" />
                <span>Create Assignment</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Classroom Info */}
      {classroom && (
        <Card>
          <CardHeader>
            <CardTitle>Classroom Information</CardTitle>
            <CardDescription>Your classroom details and public portal link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Username</p>
                <p className="text-lg font-semibold">{classroom.username}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2">Student/Parent Portal Link</p>
              <CopyButton username={classroom.username} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
