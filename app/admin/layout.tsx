import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is super admin
  const { data: profile } = await supabase.from("profiles").select("role, email").eq("id", user.id).single()

  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={{ email: profile.email }} />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Super Admin Portal</h1>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
