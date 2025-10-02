import { generateObject } from "ai"
import { z } from "zod"

const gradeSchema = z.object({
  grades: z.array(
    z.object({
      studentName: z.string().describe("Full name of the student"),
      marks: z.number().describe("Marks obtained by the student"),
      rollNumber: z.string().optional().describe("Roll number or ID if visible"),
    }),
  ),
  subject: z.string().optional().describe("Subject name if visible"),
  totalMarks: z.number().optional().describe("Total marks for the exam"),
})

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    const { object } = await generateObject({
      model: "groq/llama-3.2-90b-vision-preview",
      schema: gradeSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all student grades from this mark sheet image. Include student names, marks obtained, and any other visible information like roll numbers or subject details.",
            },
            {
              type: "image",
              image,
            },
          ],
        },
      ],
    })

    return Response.json({ extractedGrades: object })
  } catch (error: any) {
    console.error("[v0] Error extracting grades:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
