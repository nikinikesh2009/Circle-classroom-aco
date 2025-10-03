import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddSchoolForm } from "@/components/admin/add-school-form"

export default async function NewSchoolPage() {
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

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New School</h2>
        <p className="text-muted-foreground">Register a new school to the platform</p>
      </div>

      <AddSchoolForm />
    </div>
  )
}
