"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createClassroom(formData: {
  classroomName: string
  username: string
  gradeLevel: string
  academicYear: string
  teacherName: string
  teacherEmail: string
  teacherPhone: string
}) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: existingClassroom } = await supabase
    .from("classrooms")
    .select("username")
    .eq("username", formData.username)
    .maybeSingle()

  if (existingClassroom) {
    return { error: "Username already taken. Please choose another." }
  }

  const { data: classroom, error: classroomError } = await supabase
    .from("classrooms")
    .insert({
      name: formData.classroomName,
      username: formData.username,
      grade_level: formData.gradeLevel,
      academic_year: formData.academicYear,
      teacher_id: user.id,
    })
    .select()
    .single()

  if (classroomError) {
    return { error: classroomError.message }
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      classroom_id: classroom.id,
      full_name: formData.teacherName,
      email: formData.teacherEmail,
    })
    .eq("id", user.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Revalidate the dashboard path to ensure fresh data
  revalidatePath("/dashboard")

  // Redirect to dashboard
  redirect("/dashboard")
}
