"use client"
import { Shield, Building2, Users, Activity, BarChart3, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "Schools",
    url: "/admin/schools",
    icon: Building2,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "System Controls",
    url: "/admin/system",
    icon: Activity,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
]

export function AdminSidebar({ user }: { user: { email?: string } }) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive">
            <Shield className="h-6 w-6 text-destructive-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Super Admin</span>
            <span className="text-xs text-muted-foreground">Platform Control</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground truncate">{user.email}</div>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
