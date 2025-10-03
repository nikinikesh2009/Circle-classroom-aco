import { generateText } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const requestSchema = z.object({
  grades: z
    .array(
      z.object({
        student_name: z.string(),
        marks_obtained: z.number().min(0),
      }),
    )
    .min(1, "At least one grade is required"),
  assignmentTitle: z.string().min(1, "Assignment title is required"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0"),
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validation = requestSchema.safeParse(body)

    if (!validation.success) {
      return Response.json({ error: "Invalid request", details: validation.error.errors }, { status: 400 })
    }

    const { grades, assignmentTitle, totalMarks } = validation.data

    const prompt = `Analyze these student grades and provide insights:

Assignment: ${assignmentTitle}
Total Marks: ${totalMarks}

Grades:
${grades.map((g) => `${g.student_name}: ${g.marks_obtained}/${totalMarks}`).join("\n")}

Provide:
1. Class average and median
2. Top 3 performers
3. Students who need attention (below 50%)
4. Difficulty analysis (was the exam too easy/hard?)
5. Specific recommendations for improvement

Format the response in a clear, structured way.`

    const { text } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt,
      maxOutputTokens: 2000,
    })

    return Response.json({ analysis: text })
  } catch (error: any) {
    console.error("[v0] Error analyzing results:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
