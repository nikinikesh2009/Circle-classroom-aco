"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  first_name: string
  last_name: string
}

interface AttendanceRecord {
  student_id: string
  status: "present" | "absent"
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    loadStudents()
    loadAttendance()
  }, [selectedDate])

  const loadStudents = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase
        .from("students")
        .select("id, first_name, last_name")
        .eq("classroom_id", profile?.classroom_id)
        .order("first_name")

      if (error) throw error
      setStudents(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadAttendance = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("classroom_id", profile?.classroom_id)
        .eq("date", selectedDate)

      if (error) throw error

      const attendanceMap: Record<string, "present" | "absent"> = {}
      data?.forEach((record) => {
        attendanceMap[record.student_id] = record.status
      })
      setAttendance(attendanceMap)
    } catch (error: any) {
      console.error("[v0] Error loading attendance:", error)
    }
  }

  const toggleAttendance = (studentId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? "absent" : status,
    }))
  }

  const saveAttendance = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      await supabase.from("attendance").delete().eq("classroom_id", profile?.classroom_id).eq("date", selectedDate)

      const records = Object.entries(attendance).map(([student_id, status]) => ({
        classroom_id: profile?.classroom_id,
        student_id,
        date: selectedDate,
        status,
      }))

      const { error } = await supabase.from("attendance").insert(records)

      if (error) throw error

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Take Attendance
          </CardTitle>
          <CardDescription>Mark students as present or absent for the selected date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
            <div className="text-sm text-muted-foreground">{students.length} students</div>
          </div>

          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">
                  {student.first_name} {student.last_name}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                    onClick={() => toggleAttendance(student.id, "present")}
                    className={attendance[student.id] === "present" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    size="sm"
                    variant={attendance[student.id] === "absent" ? "default" : "outline"}
                    onClick={() => toggleAttendance(student.id, "absent")}
                    className={attendance[student.id] === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={saveAttendance} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
