"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface GradeScale {
  grade: string
  min_percentage: number
  max_percentage: number
}

export default function NewAssignmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    total_marks: 100,
    pass_marks: 40,
    date: new Date().toISOString().split("T")[0],
  })
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([
    { grade: "A+", min_percentage: 90, max_percentage: 100 },
    { grade: "A", min_percentage: 80, max_percentage: 89 },
    { grade: "B", min_percentage: 70, max_percentage: 79 },
    { grade: "C", min_percentage: 60, max_percentage: 69 },
    { grade: "D", min_percentage: 40, max_percentage: 59 },
    { grade: "F", min_percentage: 0, max_percentage: 39 },
  ])

  const addGrade = () => {
    setGradeScale([...gradeScale, { grade: "", min_percentage: 0, max_percentage: 0 }])
  }

  const removeGrade = (index: number) => {
    setGradeScale(gradeScale.filter((_, i) => i !== index))
  }

  const updateGrade = (index: number, field: keyof GradeScale, value: string | number) => {
    const updated = [...gradeScale]
    updated[index] = { ...updated[index], [field]: value }
    setGradeScale(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { error } = await supabase.from("assignments").insert({
        ...formData,
        classroom_id: profile?.classroom_id,
        grade_scale: gradeScale,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Assignment created successfully",
      })

      router.push("/dashboard/assignments")
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
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/dashboard/assignments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Assignment</CardTitle>
          <CardDescription>Set up a new exam or assignment with custom grading scale</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mid-term Exam"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="total_marks">Total Marks *</Label>
                <Input
                  id="total_marks"
                  type="number"
                  required
                  value={formData.total_marks}
                  onChange={(e) => setFormData({ ...formData, total_marks: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass_marks">Pass Marks *</Label>
                <Input
                  id="pass_marks"
                  type="number"
                  required
                  value={formData.pass_marks}
                  onChange={(e) => setFormData({ ...formData, pass_marks: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Grading Scale</Label>
                <Button type="button" variant="outline" size="sm" onClick={addGrade}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Grade
                </Button>
              </div>
              <div className="space-y-2">
                {gradeScale.map((grade, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Grade"
                      value={grade.grade}
                      onChange={(e) => updateGrade(index, "grade", e.target.value)}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Min %"
                      value={grade.min_percentage}
                      onChange={(e) => updateGrade(index, "min_percentage", Number.parseInt(e.target.value))}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      placeholder="Max %"
                      value={grade.max_percentage}
                      onChange={(e) => updateGrade(index, "max_percentage", Number.parseInt(e.target.value))}
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeGrade(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
