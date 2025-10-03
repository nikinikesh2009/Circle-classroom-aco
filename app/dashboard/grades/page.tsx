export const dynamic = "force-dynamic"
;("use client")

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: string
  title: string
  subject: string
  total_marks: number
}

interface Student {
  id: string
  first_name: string
  last_name: string
}

export default function GradesPage() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [grades, setGrades] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue",
          variant: "destructive",
        })
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        toast({
          title: "Setup Required",
          description: "Please complete classroom setup first",
          variant: "destructive",
        })
        return
      }

      const [assignmentsRes, studentsRes] = await Promise.all([
        supabase
          .from("assignments")
          .select("id, title, subject, total_marks")
          .eq("classroom_id", profile.classroom_id)
          .order("created_at", { ascending: false }),
        supabase
          .from("students")
          .select("id, first_name, last_name")
          .eq("classroom_id", profile.classroom_id)
          .order("first_name"),
      ])

      setAssignments(assignmentsRes.data || [])
      setStudents(studentsRes.data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setExtracting(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string

        const response = await fetch("/api/ai/extract-grades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        })

        const { extractedGrades } = await response.json()

        const gradesMap: Record<string, number> = {}
        extractedGrades.grades.forEach((grade: any) => {
          const student = students.find((s) =>
            `${s.first_name} ${s.last_name}`.toLowerCase().includes(grade.studentName.toLowerCase()),
          )
          if (student) {
            gradesMap[student.id] = grade.marks
          }
        })

        setGrades(gradesMap)
        toast({
          title: "Success",
          description: `Extracted ${Object.keys(gradesMap).length} grades from image`,
        })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setExtracting(false)
    }
  }

  const saveGrades = async () => {
    if (!selectedAssignment) return

    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        toast({
          title: "Setup Required",
          description: "Please complete classroom setup first",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const assignment = assignments.find((a) => a.id === selectedAssignment)

      const gradeRecords = Object.entries(grades).map(([student_id, marks]) => {
        const student = students.find((s) => s.id === student_id)
        const percentage = (marks / (assignment?.total_marks || 100)) * 100

        return {
          classroom_id: profile.classroom_id,
          assignment_id: selectedAssignment,
          student_id,
          student_name: `${student?.first_name} ${student?.last_name}`,
          marks_obtained: marks,
          percentage,
        }
      })

      await supabase.from("grades").delete().eq("assignment_id", selectedAssignment)

      const { error } = await supabase.from("grades").insert(gradeRecords)

      if (error) throw error

      toast({
        title: "Success",
        description: "Grades saved successfully",
      })
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

  return (
    <div className="container max-w-6xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Grade Entry</CardTitle>
          <CardDescription>Enter grades manually or use AI to extract from a mark sheet image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title} - {assignment.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={!selectedAssignment || extracting}
              />
              <label htmlFor="image-upload">
                <Button asChild disabled={!selectedAssignment || extracting}>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {extracting ? "Extracting..." : "Upload Mark Sheet"}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {selectedAssignment && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 font-semibold text-sm pb-2 border-b">
                <div>Student Name</div>
                <div>Marks Obtained</div>
              </div>
              {students.map((student) => (
                <div key={student.id} className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    {student.first_name} {student.last_name}
                  </div>
                  <Input
                    type="number"
                    value={grades[student.id] || ""}
                    onChange={(e) => setGrades({ ...grades, [student.id]: Number.parseFloat(e.target.value) })}
                    placeholder="Enter marks"
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={saveGrades}
            disabled={!selectedAssignment || loading || Object.keys(grades).length === 0}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Grades"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
