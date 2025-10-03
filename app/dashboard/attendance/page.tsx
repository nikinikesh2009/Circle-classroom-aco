"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Check, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string
  first_name: string
  last_name: string
  photo_url: string | null
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent">>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        throw new Error("Classroom not found. Please complete setup first.")
      }

      const { data, error } = await supabase
        .from("students")
        .select("id, first_name, last_name, photo_url")
        .eq("classroom_id", profile.classroom_id)
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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        return
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const { data, error } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("classroom_id", profile.classroom_id)
        .eq("date", dateStr)

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        throw new Error("Classroom not found. Please complete setup first.")
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd")
      await supabase.from("attendance").delete().eq("classroom_id", profile.classroom_id).eq("date", dateStr)

      const records = Object.entries(attendance).map(([student_id, status]) => ({
        classroom_id: profile.classroom_id,
        student_id,
        date: dateStr,
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

  const presentCount = Object.values(attendance).filter((s) => s === "present").length
  const absentCount = Object.values(attendance).filter((s) => s === "absent").length
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Take Attendance</h2>
          <p className="text-muted-foreground">Mark students as present or absent</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className={cn("gap-2 font-normal", !selectedDate && "text-muted-foreground")}
            >
              <CalendarIcon className="h-5 w-5" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl">{students.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Present Today</CardDescription>
            <CardTitle className="text-3xl text-green-600">{presentCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Attendance Rate</CardDescription>
            <CardTitle className="text-3xl">{attendanceRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Click to mark attendance for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.photo_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {student.first_name[0]}
                      {student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {attendance[student.id] === "present" && "✓ Present"}
                      {attendance[student.id] === "absent" && "✗ Absent"}
                      {!attendance[student.id] && "Not marked"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="lg"
                    variant={attendance[student.id] === "present" ? "default" : "outline"}
                    onClick={() => toggleAttendance(student.id, "present")}
                    className={cn(
                      "gap-2 min-w-[120px]",
                      attendance[student.id] === "present" && "bg-green-600 hover:bg-green-700",
                    )}
                  >
                    <Check className="h-5 w-5" />
                    Present
                  </Button>
                  <Button
                    size="lg"
                    variant={attendance[student.id] === "absent" ? "default" : "outline"}
                    onClick={() => toggleAttendance(student.id, "absent")}
                    className={cn(
                      "gap-2 min-w-[120px]",
                      attendance[student.id] === "absent" && "bg-red-600 hover:bg-red-700",
                    )}
                  >
                    <X className="h-5 w-5" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex justify-end gap-4 rounded-lg border bg-background p-4 shadow-lg">
        <Button variant="outline" size="lg" onClick={loadAttendance}>
          Cancel
        </Button>
        <Button size="lg" onClick={saveAttendance} disabled={saving} className="gap-2 min-w-[140px]">
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  )
}
