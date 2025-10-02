"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface TimetableEntry {
  id?: string
  day: string
  start_time: string
  end_time: string
  subject: string
  teacher: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function EditTimetablePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTimetable()
  }, [])

  const loadTimetable = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      const { data, error } = await supabase
        .from("timetable")
        .select("*")
        .eq("classroom_id", profile?.classroom_id)
        .order("day, start_time")

      if (error) throw error
      setEntries(data || [])
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

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        day: "Monday",
        start_time: "09:00",
        end_time: "10:00",
        subject: "",
        teacher: "",
      },
    ])
  }

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const updateEntry = (index: number, field: keyof TimetableEntry, value: string) => {
    const updated = [...entries]
    updated[index] = { ...updated[index], [field]: value }
    setEntries(updated)
  }

  const saveTimetable = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("classroom_id").eq("id", user.id).single()

      await supabase.from("timetable").delete().eq("classroom_id", profile?.classroom_id)

      const records = entries.map((entry) => ({
        ...entry,
        classroom_id: profile?.classroom_id,
      }))

      const { error } = await supabase.from("timetable").insert(records)

      if (error) throw error

      toast({
        title: "Success",
        description: "Timetable saved successfully",
      })

      router.push("/dashboard/timetable")
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

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/dashboard/timetable">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Timetable
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Timetable</CardTitle>
          <CardDescription>Add, edit, or remove class sessions from your weekly schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select value={entry.day} onValueChange={(value) => updateEntry(index, "day", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={entry.subject}
                      onChange={(e) => updateEntry(index, "subject", e.target.value)}
                      placeholder="Mathematics"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={entry.start_time}
                      onChange={(e) => updateEntry(index, "start_time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={entry.end_time}
                      onChange={(e) => updateEntry(index, "end_time", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Teacher</Label>
                    <Input
                      value={entry.teacher}
                      onChange={(e) => updateEntry(index, "teacher", e.target.value)}
                      placeholder="Teacher name"
                    />
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeEntry(index)}>
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addEntry} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Class Session
          </Button>

          <Button onClick={saveTimetable} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Timetable"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
