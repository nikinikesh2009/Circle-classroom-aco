"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, LogIn, Clock } from "lucide-react"
import Link from "next/link"

interface Classroom {
  id: string
  name: string
  teacher_name: string
  teacher_email: string
  teacher_phone: string
}

interface Notice {
  id: string
  title: string
  content: string
  date: string
}

interface TimetableEntry {
  id: string
  day: string
  start_time: string
  end_time: string
  subject: string
  teacher: string
}

export default function PublicPortalPage() {
  const params = useParams()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [notices, setNotices] = useState<Notice[]>([])
  const [todaySchedule, setTodaySchedule] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortalData()
  }, [params.username])

  const loadPortalData = async () => {
    try {
      const supabase = createClient()

      const { data: classroomData, error: classroomError } = await supabase
        .from("classrooms")
        .select("*")
        .eq("username", params.username)
        .single()

      if (classroomError) throw classroomError
      setClassroom(classroomData)

      const [noticesRes, timetableRes] = await Promise.all([
        supabase
          .from("notices")
          .select("*")
          .eq("classroom_id", classroomData.id)
          .order("date", { ascending: false })
          .limit(5),
        supabase
          .from("timetable")
          .select("*")
          .eq("classroom_id", classroomData.id)
          .eq("day", new Date().toLocaleDateString("en-US", { weekday: "long" }))
          .order("start_time"),
      ])

      setNotices(noticesRes.data || [])
      setTodaySchedule(timetableRes.data || [])
    } catch (error: any) {
      console.error("[v0] Error loading portal:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Classroom Not Found</CardTitle>
            <CardDescription>The classroom you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {classroom.name}
              </h1>
              <p className="text-sm text-muted-foreground">Teacher: {classroom.teacher_name}</p>
            </div>
            <Link href={`/view/${params.username}/login`}>
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todaySchedule.length === 0 ? (
                <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todaySchedule.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{entry.subject}</p>
                        <p className="text-sm text-muted-foreground">{entry.teacher}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {entry.start_time} - {entry.end_time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Recent Notices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notices available</p>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div key={notice.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notice.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(notice.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Teacher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Name:</strong> {classroom.teacher_name}
            </p>
            {classroom.teacher_email && (
              <p className="text-sm">
                <strong>Email:</strong> {classroom.teacher_email}
              </p>
            )}
            {classroom.teacher_phone && (
              <p className="text-sm">
                <strong>Phone:</strong> {classroom.teacher_phone}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
