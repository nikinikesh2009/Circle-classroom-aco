"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Award, LogOut } from "lucide-react"

interface Grade {
  assignment_title: string
  subject: string
  marks_obtained: number
  total_marks: number
  percentage: number
}

interface AttendanceSummary {
  total_days: number
  present_days: number
  attendance_percentage: number
}

export default function StudentProgressPage() {
  const params = useParams()
  const router = useRouter()
  const [studentName, setStudentName] = useState("")
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("student_session")
    if (!session) {
      router.push(`/view/${params.username}/login`)
      return
    }

    const { student_id, classroom_username, student_name } = JSON.parse(session)
    if (classroom_username !== params.username) {
      router.push(`/view/${params.username}/login`)
      return
    }

    setStudentName(student_name)
    loadProgress(student_id)
  }, [])

  const loadProgress = async (studentId: string) => {
    try {
      const supabase = createClient()

      const { data: gradesData } = await supabase
        .from("grades")
        .select(`
          marks_obtained,
          percentage,
          assignment_id,
          assignments!inner (
            title,
            subject,
            total_marks
          )
        `)
        .eq("student_id", studentId)

      const formattedGrades =
        gradesData?.map((g: any) => ({
          assignment_title: g.assignments.title,
          subject: g.assignments.subject,
          marks_obtained: g.marks_obtained,
          total_marks: g.assignments.total_marks,
          percentage: g.percentage,
        })) || []

      setGrades(formattedGrades)

      const { data: attendanceData } = await supabase.from("attendance").select("status").eq("student_id", studentId)

      const totalDays = attendanceData?.length || 0
      const presentDays = attendanceData?.filter((a) => a.status === "present").length || 0
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0

      setAttendance({
        total_days: totalDays,
        present_days: presentDays,
        attendance_percentage: attendancePercentage,
      })
    } catch (error: any) {
      console.error("[v0] Error loading progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("student_session")
    router.push(`/view/${params.username}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                My Progress
              </h1>
              <p className="text-sm text-muted-foreground">{studentName}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendance && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Present Days:</span>
                    <span className="font-medium">
                      {attendance.present_days} / {attendance.total_days}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Attendance Rate:</span>
                    <span className="font-medium">{attendance.attendance_percentage.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Assignments:</span>
                  <span className="font-medium">{grades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Score:</span>
                  <span className="font-medium">
                    {grades.length > 0
                      ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Grade Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No grades available yet</p>
            ) : (
              <div className="space-y-3">
                {grades.map((grade, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{grade.assignment_title}</p>
                        <p className="text-sm text-muted-foreground">{grade.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {grade.marks_obtained}/{grade.total_marks}
                        </p>
                        <p className="text-sm text-muted-foreground">{grade.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
