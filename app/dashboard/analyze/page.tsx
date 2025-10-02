"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Assignment {
  id: string
  title: string
  subject: string
  total_marks: number
}

export default function AnalyzePage() {
  const { toast } = useToast()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, subject, total_marks")
        .eq("classroom_id", profile?.classroom_id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setAssignments(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const analyzeResults = async () => {
    if (!selectedAssignment) return

    setLoading(true)
    try {
      const supabase = createClient()

      const assignment = assignments.find((a) => a.id === selectedAssignment)

      const { data: grades, error } = await supabase
        .from("grades")
        .select("student_name, marks_obtained")
        .eq("assignment_id", selectedAssignment)

      if (error) throw error

      const response = await fetch("/api/ai/analyze-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grades,
          assignmentTitle: assignment?.title,
          totalMarks: assignment?.total_marks,
        }),
      })

      const { analysis: aiAnalysis } = await response.json()
      setAnalysis(aiAnalysis)
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Smart Result Analyzer
          </CardTitle>
          <CardDescription>AI-powered insights into student performance and exam difficulty</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Assignment</label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an assignment to analyze" />
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

          <Button onClick={analyzeResults} disabled={!selectedAssignment || loading} className="w-full">
            {loading ? "Analyzing..." : "Analyze Results"}
          </Button>

          {analysis && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI Analysis
              </h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">{analysis}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
