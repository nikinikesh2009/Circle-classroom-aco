"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Download, Mail, Phone, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface Student {
  id: string
  first_name: string
  last_name: string
  login_id: string
  date_of_birth: string
  gender: string
  parent_name: string
  parent_email: string
  parent_phone: string
  emergency_contact: string
  emergency_phone: string
  medical_notes: string
  address: string
  photo_url: string | null
  classroom_id: string
}

export default function StudentProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [student, setStudent] = useState<Student | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudent()
  }, [params.id])

  const loadStudent = async () => {
    try {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to continue",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data: classroom } = await supabase.from("classrooms").select("id").eq("teacher_id", user.id).maybeSingle()

      if (!classroom) {
        toast({
          title: "Setup Required",
          description: "Please complete classroom setup first",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", params.id)
        .eq("classroom_id", classroom.id)
        .maybeSingle()

      if (error) throw error
      if (!data) {
        setStudent(null)
        setLoading(false)
        return
      }
      setStudent(data)

      const qrUrl = await QRCode.toDataURL(data.login_id)
      setQrCodeUrl(qrUrl)
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

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.download = `${student?.first_name}_${student?.last_name}_QR.png`
    link.href = qrCodeUrl
    link.click()
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!student) {
    return <div className="container py-8">Student not found</div>
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </Link>
        <Link href={`/dashboard/students/${student.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 rounded-full bg-violet-100 flex items-center justify-center">
                <User className="h-16 w-16 text-violet-600" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="text-sm text-muted-foreground">Login ID: {student.login_id}</p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(student.date_of_birth).toLocaleDateString()}</span>
              </div>
              {student.gender && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{student.gender}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">QR Code Login</h3>
              <div className="flex flex-col items-center space-y-3">
                {qrCodeUrl && <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 h-48" />}
                <Button onClick={downloadQRCode} variant="outline" size="sm" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="contact" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="contact" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Parent/Guardian</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{student.parent_name}</span>
                    </div>
                    {student.parent_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{student.parent_phone}</span>
                      </div>
                    )}
                    {student.parent_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{student.parent_email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {student.emergency_contact && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{student.emergency_contact}</span>
                      </div>
                      {student.emergency_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{student.emergency_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {student.address && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Address</h3>
                    <p className="text-sm">{student.address}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="medical">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Medical Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.medical_notes || "No medical notes recorded"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="records">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Attendance and grade records will appear here</p>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
