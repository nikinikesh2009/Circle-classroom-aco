"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Download, FileSpreadsheet, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Student {
  id: string
  first_name: string
  last_name: string
  student_id: string
}

export function ReportsTab({ students, userId }: { students: Student[]; userId: string }) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const exportToCSV = async (type: "students" | "attendance") => {
    setLoading(true)

    if (type === "students") {
      const csvContent = [
        ["Student ID", "First Name", "Last Name", "Grade Level", "Parent Name", "Parent Phone", "Parent Email"].join(
          ",",
        ),
        ...students.map((s) =>
          [
            s.student_id,
            s.first_name,
            s.last_name,
            (s as any).grade_level || "",
            (s as any).parent_guardian_name || "",
            (s as any).parent_guardian_phone || "",
            (s as any).parent_guardian_email || "",
          ].join(","),
        ),
      ].join("\n")

      downloadCSV(csvContent, "students_roster.csv")
    } else {
      const { data: attendance } = await supabase
        .from("attendance")
        .select("*, students(*)")
        .in(
          "student_id",
          students.map((s) => s.id),
        )
        .order("date", { ascending: false })

      const csvContent = [
        ["Date", "Student ID", "Student Name", "Status"].join(","),
        ...(attendance || []).map((a: any) =>
          [a.date, a.students.student_id, `${a.students.first_name} ${a.students.last_name}`, a.status].join(","),
        ),
      ].join("\n")

      downloadCSV(csvContent, "attendance_report.csv")
    }

    setLoading(false)
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const generateAttendanceSummary = async () => {
    setLoading(true)

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*, students(*)")
      .in(
        "student_id",
        students.map((s) => s.id),
      )

    const summary: Record<string, { present: number; absent: number; late: number; excused: number; total: number }> =
      {}

    students.forEach((student) => {
      summary[student.id] = { present: 0, absent: 0, late: 0, excused: 0, total: 0 }
    })

    attendance?.forEach((record: any) => {
      if (summary[record.student_id]) {
        summary[record.student_id][record.status as keyof (typeof summary)[string]]++
        summary[record.student_id].total++
      }
    })

    const csvContent = [
      ["Student ID", "Student Name", "Total Days", "Present", "Absent", "Late", "Excused", "Attendance Rate"].join(","),
      ...students.map((s) => {
        const stats = summary[s.id]
        const rate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : "0"
        return [
          s.student_id,
          `${s.first_name} ${s.last_name}`,
          stats.total,
          stats.present,
          stats.absent,
          stats.late,
          stats.excused,
          `${rate}%`,
        ].join(",")
      }),
    ].join("\n")

    downloadCSV(csvContent, "attendance_summary.csv")
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Reports & Export</h3>
        <p className="text-sm text-muted-foreground">Export your classroom data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportToCSV("students")}>
          <CardHeader>
            <FileSpreadsheet className="w-8 h-8 text-violet-600 mb-2" />
            <CardTitle className="text-base">Student Roster</CardTitle>
            <CardDescription>Export complete student list with contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => exportToCSV("attendance")}>
          <CardHeader>
            <Calendar className="w-8 h-8 text-violet-600 mb-2" />
            <CardTitle className="text-base">Attendance Records</CardTitle>
            <CardDescription>Export all attendance records with dates and status</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={generateAttendanceSummary}>
          <CardHeader>
            <FileText className="w-8 h-8 text-violet-600 mb-2" />
            <CardTitle className="text-base">Attendance Summary</CardTitle>
            <CardDescription>Generate summary report with attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled={loading}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Management</CardTitle>
          <CardDescription>Backup and restore your classroom data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Full Data Backup</div>
              <div className="text-sm text-muted-foreground">Export all students, attendance, and records</div>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Backup All
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">Last backup: {format(new Date(), "MMMM d, yyyy")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
