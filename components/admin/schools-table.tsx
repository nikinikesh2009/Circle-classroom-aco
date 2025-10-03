"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type School = {
  id: string
  name: string
  admin_email: string
  admin_name: string | null
  status: string
  subscription_tier: string
  student_count: number
  max_students: number
  created_at: string
}

export function SchoolsTable({ schools }: { schools: School[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.admin_email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStatusChange = async (schoolId: string, newStatus: string) => {
    setIsLoading(schoolId)
    try {
      const { error } = await supabase.from("schools").update({ status: newStatus }).eq("id", schoolId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error updating school status:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Suspended
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTierBadge = (tier: string) => {
    const colors = {
      free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      premium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      enterprise: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    }

    return <Badge className={colors[tier as keyof typeof colors] || ""}>{tier.toUpperCase()}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schools by name or admin email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No schools found
                </TableCell>
              </TableRow>
            ) : (
              filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.admin_email}</TableCell>
                  <TableCell>
                    {school.student_count} / {school.max_students}
                  </TableCell>
                  <TableCell>{getStatusBadge(school.status)}</TableCell>
                  <TableCell>{getTierBadge(school.subscription_tier)}</TableCell>
                  <TableCell>{new Date(school.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={isLoading === school.id}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(school.id, "active")}>
                          Activate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(school.id, "inactive")}>
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(school.id, "suspended")}
                          className="text-destructive"
                        >
                          Suspend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
