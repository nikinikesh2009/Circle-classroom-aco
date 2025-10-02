"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Check, X, Clock, FileCheck } from "lucide-react"
import { format } from "date-fns"

interface Student {
  id: string
  first_name: string
  last_name: string
  student_id: string
}

interface AttendanceRecord {
  id: string
  student_id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
}

export function AttendanceTab({ students, userId }: { students: Student[]; userId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendance, setAttendance] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, excused: 0 })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAttendance()
  }, [selectedDate])

  const loadAttendance = async () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const { data } = await supabase
      .from("attendance")
      .select("*")
      .eq("date", dateStr)
      .in(
        "student_id",
        students.map((s) => s.id),
      )

    const attendanceMap: Record<string, string> = {}
    data?.forEach((record: AttendanceRecord) => {
      attendanceMap[record.student_id] = record.status
    })
    setAttendance(attendanceMap)

    // Calculate stats
    const present = Object.values(attendanceMap).filter((s) => s === "present").length
    const absent = Object.values(attendanceMap).filter((s) => s === "absent").length
    const late = Object.values(attendanceMap).filter((s) => s === "late").length
    const excused = Object.values(attendanceMap).filter((s) => s === "excused").length
    setStats({ present, absent, late, excused })
  }

  const markAttendance = async (studentId: string, status: string) => {
    const dateStr = format(selectedDate, "yyyy-MM-dd")

    const { error } = await supabase.from("attendance").upsert(
      {
        student_id: studentId,
        date: dateStr,
        status,
      },
      {
        onConflict: "student_id,date",
      },
    )

    if (!error) {
      setAttendance({ ...attendance, [studentId]: status })
      loadAttendance()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200"
      case "absent":
        return "bg-red-100 text-red-800 border-red-200"
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Attendance Tracking</h3>
          <p className="text-sm text-muted-foreground">Mark and track student attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Attendance for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>{students.length} total students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <Check className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                <X className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                <div className="text-sm text-muted-foreground">Late</div>
              </div>
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <FileCheck className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                <div className="text-sm text-muted-foreground">Excused</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="font-medium">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">ID: {student.student_id}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, "present")}
                    className={attendance[student.id] === "present" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "absent" ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, "absent")}
                    className={attendance[student.id] === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Absent
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "late" ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, "late")}
                    className={attendance[student.id] === "late" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Late
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "excused" ? "default" : "outline"}
                    onClick={() => markAttendance(student.id, "excused")}
                    className={attendance[student.id] === "excused" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <FileCheck className="w-4 h-4 mr-1" />
                    Excused
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
