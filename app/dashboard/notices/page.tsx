"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Plus, Trash, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notice {
  id: string
  title: string
  content: string
  date: string
  created_at: string
}

export default function NoticesPage() {
  const { toast } = useToast()
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadNotices()
  }, [])

  const loadNotices = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("classroom_id", profile?.classroom_id)
        .order("date", { ascending: false })

      if (error) throw error
      setNotices(data || [])
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

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { error } = await supabase.from("notices").insert({
        ...formData,
        classroom_id: profile?.classroom_id,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Notice created successfully",
      })

      setFormData({ title: "", content: "", date: new Date().toISOString().split("T")[0] })
      setShowForm(false)
      loadNotices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const deleteNotice = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("notices").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Notice deleted successfully",
      })

      loadNotices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">School Notices</h1>
          <p className="text-muted-foreground">Manage announcements and important updates</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          New Notice
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Notice</CardTitle>
            <CardDescription>Post an announcement for students and parents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createNotice} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Holiday Announcement"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="School will be closed on..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Notice</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notices yet. Create your first announcement!</p>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{notice.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(notice.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteNotice(notice.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{notice.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
