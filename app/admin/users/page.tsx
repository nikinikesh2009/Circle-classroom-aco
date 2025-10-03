import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/admin/users-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersManagementPage() {
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

  // Fetch all users with their school information
  const { data: users } = await supabase
    .from("profiles")
    .select(
      `
      *,
      schools (
        name
      )
    `,
    )
    .order("created_at", { ascending: false })

  // Get activity logs for each user (last login)
  const usersWithActivity = await Promise.all(
    (users || []).map(async (user) => {
      const { data: lastActivity } = await supabase
        .from("audit_logs")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      return {
        ...user,
        last_activity: lastActivity?.created_at || null,
      }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Administration</h2>
          <p className="text-muted-foreground">Manage all platform users and their roles</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <UsersTable users={usersWithActivity} />
    </div>
  )
}
