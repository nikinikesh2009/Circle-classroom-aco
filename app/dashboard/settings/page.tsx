"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, User, School } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Classroom {
  id: string
  name: string
  username: string
  teacher_name: string
  teacher_email: string
  teacher_phone: string
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase.from("classrooms").select("*").eq("id", profile?.classroom_id).single()

      if (error) throw error
      setClassroom(data)
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

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!classroom) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("classrooms")
        .update({
          name: classroom.name,
          teacher_name: classroom.teacher_name,
          teacher_email: classroom.teacher_email,
          teacher_phone: classroom.teacher_phone,
        })
        .eq("id", classroom.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!classroom) {
    return <div className="container py-8">Classroom not found</div>
  }

  const publicPortalUrl = `${window.location.origin}/view/${classroom.username}`

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your classroom and profile settings</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Classroom Information
            </CardTitle>
            <CardDescription>Basic information about your classroom</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Classroom Name *</Label>
                <Input
                  id="name"
                  required
                  value={classroom.name}
                  onChange={(e) => setClassroom({ ...classroom, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Public Username</Label>
                <Input id="username" value={classroom.username} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  This username cannot be changed. Students and parents can access the public portal at:
                </p>
                <a
                  href={publicPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-violet-600 hover:underline break-all"
                >
                  {publicPortalUrl}
                </a>
              </div>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Teacher Profile
            </CardTitle>
            <CardDescription>Your contact information visible to students and parents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher_name">Full Name *</Label>
                <Input
                  id="teacher_name"
                  required
                  value={classroom.teacher_name}
                  onChange={(e) => setClassroom({ ...classroom, teacher_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher_email">Email</Label>
                <Input
                  id="teacher_email"
                  type="email"
                  value={classroom.teacher_email || ""}
                  onChange={(e) => setClassroom({ ...classroom, teacher_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher_phone">Phone</Label>
                <Input
                  id="teacher_phone"
                  type="tel"
                  value={classroom.teacher_phone || ""}
                  onChange={(e) => setClassroom({ ...classroom, teacher_phone: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
