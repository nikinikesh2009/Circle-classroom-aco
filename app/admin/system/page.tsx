import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SystemControlsPanel } from "@/components/admin/system-controls-panel"

export default async function SystemControlsPage() {
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

  // Fetch system announcements
  const { data: announcements } = await supabase
    .from("system_announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch API keys
  const { data: apiKeys } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Controls</h2>
        <p className="text-muted-foreground">Platform-wide settings and emergency controls</p>
      </div>

      <SystemControlsPanel announcements={announcements || []} apiKeys={apiKeys || []} />
    </div>
  )
}
