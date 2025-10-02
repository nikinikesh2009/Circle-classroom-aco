import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StudentsRoster } from "@/components/students-roster"

export default async function StudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: classroom } = await supabase.from("classrooms").select("*").eq("teacher_id", user.id).single()

  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("classroom_id", classroom?.id)
    .order("last_name", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <StudentsRoster students={students || []} classroomId={classroom?.id || ""} />
    </div>
  )
}
