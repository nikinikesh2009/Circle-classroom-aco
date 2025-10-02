import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { grades, assignmentTitle, totalMarks } = await req.json()

    const prompt = `Analyze these student grades and provide insights:

Assignment: ${assignmentTitle}
Total Marks: ${totalMarks}

Grades:
${grades.map((g: any) => `${g.student_name}: ${g.marks_obtained}/${totalMarks}`).join("\n")}

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
