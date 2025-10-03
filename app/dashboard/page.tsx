import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, TrendingUp, ClipboardCheck } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-dynamic"

// Mock data for stable rendering
const mockClassroom = {
  name: "Demo Classroom",
  grade_level: "5th Grade",
  academic_year: "2024-2025",
}

const mockStats = {
  totalStudents: 24,
  presentToday: 22,
  totalAssignments: 8,
  attendanceRate: 92,
}

export default async function DashboardPage() {
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
          value={String(mockStats.totalStudents)}
          change="+2 from last month"
          icon={Users}
          index={0}
        />
        <StatCard
          title="Present Today"
          value={String(mockStats.presentToday)}
          change={`${mockStats.attendanceRate}% attendance rate`}
          icon={Calendar}
          index={1}
        />
        <StatCard
          title="Assignments"
          value={String(mockStats.totalAssignments)}
          change="+3 from last month"
          icon={FileText}
          index={2}
        />
        <StatCard title="Class Average" value="87%" change="Across all assignments" icon={TrendingUp} index={3} />
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
              <p className="text-xl font-semibold">{mockClassroom.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
              <p className="text-xl font-semibold">{mockClassroom.grade_level}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Academic Year</p>
              <p className="text-xl font-semibold">{mockClassroom.academic_year}</p>
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
                <p className="text-sm text-muted-foreground">{mockStats.presentToday} students marked present</p>
              </div>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
