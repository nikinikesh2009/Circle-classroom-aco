import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SchoolsTable } from "@/components/admin/schools-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function SchoolsManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Fetch all schools with usage statistics
  const { data: schools } = await supabase.from("schools").select("*").order("created_at", { ascending: false })

  // Get student counts for each school
  const schoolsWithStats = await Promise.all(
    (schools || []).map(async (school) => {
      const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .in(
          "classroom_id",
          (
            await supabase
              .from("classrooms")
              .select("id")
              .in(
                "teacher_id",
                (await supabase.from("profiles").select("id").eq("school_id", school.id)).data?.map((p) => p.id) || [],
              )
          ).data?.map((c) => c.id) || [],
        )

      return {
        ...school,
        student_count: studentCount || 0,
      }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">School Management</h2>
          <p className="text-muted-foreground">Manage all schools and their configurations</p>
        </div>
        <Link href="/admin/schools/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Button>
        </Link>
      </div>

      <SchoolsTable schools={schoolsWithStats} />
    </div>
  )
}
