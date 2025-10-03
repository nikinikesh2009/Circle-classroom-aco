import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] Dashboard layout - User check:", { hasUser: !!user })

    if (!user) {
      console.log("[v0] No user, redirecting to login")
      redirect("/auth/login")
    }

    const classroomPromise = supabase.from("classrooms").select("name").eq("teacher_id", user.id).maybeSingle()

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: null }), 3000))

    const { data: classroom } = (await Promise.race([classroomPromise, timeoutPromise])) as any

    console.log("[v0] Classroom data:", { hasClassroom: !!classroom })

    return (
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{classroom?.name || "Circle Classroom"}</h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    )
  } catch (error) {
    console.error("[v0] Dashboard layout error:", error)
    redirect("/auth/login")
  }
}
