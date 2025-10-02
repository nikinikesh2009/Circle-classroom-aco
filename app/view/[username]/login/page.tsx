"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function StudentLoginPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loginId, setLoginId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { data: classroom } = await supabase
        .from("classrooms")
        .select("id")
        .eq("username", params.username)
        .single()

      if (!classroom) throw new Error("Classroom not found")

      const { data: student, error } = await supabase
        .from("students")
        .select("id, first_name, last_name")
        .eq("classroom_id", classroom.id)
        .eq("login_id", loginId.toUpperCase())
        .single()

      if (error || !student) {
        throw new Error("Invalid login ID")
      }

      localStorage.setItem(
        "student_session",
        JSON.stringify({
          student_id: student.id,
          classroom_username: params.username,
          student_name: `${student.first_name} ${student.last_name}`,
        }),
      )

      toast({
        title: "Success",
        description: `Welcome, ${student.first_name}!`,
      })

      router.push(`/view/${params.username}/progress`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href={`/view/${params.username}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portal
            </Button>
          </Link>
          <CardTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Student Login
          </CardTitle>
          <CardDescription>Enter your unique Login ID to view your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loginId">Login ID</Label>
              <Input
                id="loginId"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="ABC1234"
                className="uppercase"
              />
              <p className="text-xs text-muted-foreground">Your Login ID was provided by your teacher</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
