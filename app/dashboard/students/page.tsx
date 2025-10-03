import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentsRoster } from "@/components/students-roster"

export default async function StudentsPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/auth/login")
    }

    const { data: classroom, error: classroomError } = await supabase
      .from("classrooms")
      .select("*")
      .eq("teacher_id", user.id)
      .maybeSingle()

    if (classroomError) {
      console.error("[v0] Error fetching classroom:", classroomError)
      throw new Error("Failed to load classroom data")
    }

    if (!classroom) {
      redirect("/setup")
    }

    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .eq("classroom_id", classroom.id)
      .order("last_name", { ascending: true })

    if (studentsError) {
      console.error("[v0] Error fetching students:", studentsError)
      throw new Error("Failed to load students")
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <StudentsRoster students={students || []} classroomId={classroom.id} />
      </div>
    )
  } catch (error) {
    console.error("[v0] Students page error:", error)
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Unable to load students</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    )
  }
}
