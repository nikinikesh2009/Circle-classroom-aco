"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface TimetableEntry {
  id: string
  day: string
  start_time: string
  end_time: string
  subject: string
  teacher: string
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function TimetablePage() {
  const { toast } = useToast()
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("classroom_id")
        .eq("id", user.id)
        .single()

      if (profileError || !profile?.classroom_id) {
        toast({
          title: "Setup Required",
          description: "Please complete classroom setup first",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("timetable")
        .select("*")
        .eq("classroom_id", profile.classroom_id)
        .order("start_time")

      if (error) throw error

      const mappedData =
        data?.map((entry) => ({
          id: entry.id,
          day: entry.day_of_week,
          start_time: entry.start_time,
          end_time: entry.end_time,
          subject: entry.subject,
          teacher: entry.teacher_name,
        })) || []

      setTimetable(mappedData)
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

  const getEntriesForDay = (day: string) => {
    return timetable.filter((entry) => entry.day === day)
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Class Timetable</h1>
          <p className="text-muted-foreground">Weekly schedule for your classroom</p>
        </div>
        <Link href="/dashboard/timetable/edit">
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Timetable
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Monday" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {DAYS.map((day) => (
                <TabsTrigger key={day} value={day}>
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
            {DAYS.map((day) => (
              <TabsContent key={day} value={day} className="space-y-4">
                {getEntriesForDay(day).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No classes scheduled for {day}</p>
                ) : (
                  <div className="space-y-2">
                    {getEntriesForDay(day).map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold">{entry.subject}</h3>
                          <p className="text-sm text-muted-foreground">{entry.teacher}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {entry.start_time} - {entry.end_time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
