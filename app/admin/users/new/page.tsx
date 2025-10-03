import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AddUserForm } from "@/components/admin/add-user-form"

export default async function NewUserPage() {
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

  // Fetch all schools for the dropdown
  const { data: schools } = await supabase.from("schools").select("id, name").order("name")

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
        <p className="text-muted-foreground">Create a new user account on the platform</p>
      </div>

      <AddUserForm schools={schools || []} />
    </div>
  )
}
