"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { UserPlus, Search, Download, QrCode, Phone, AlertCircle, Heart } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  student_id: string
  login_id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  gender: string | null
  grade_level: string | null
  photo_url: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  blood_type: string | null
  allergies: string | null
  medical_conditions: string | null
  parent_guardian_name: string | null
  parent_guardian_phone: string | null
}

export function StudentsRoster({ students, classroomId }: { students: Student[]; classroomId: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.login_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Student Roster</h2>
          <p className="text-muted-foreground">Manage your student profiles and information</p>
        </div>
        <Link href="/dashboard/students/new">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, student ID, or login ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserPlus className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term" : "Get started by adding your first student"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/students/new">
                <Button>Add Student</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <Link key={student.id} href={`/dashboard/students/${student.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.photo_url || undefined} />
                        <AvatarFallback>
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {student.first_name} {student.last_name}
                        </CardTitle>
                        <CardDescription>ID: {student.student_id}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {student.grade_level && <Badge variant="secondary">{student.grade_level}</Badge>}

                  {student.login_id && (
                    <div className="flex items-center gap-2 text-sm bg-violet-50 p-2 rounded">
                      <QrCode className="w-4 h-4 text-violet-600" />
                      <span className="font-mono text-violet-600">{student.login_id}</span>
                    </div>
                  )}

                  {student.parent_guardian_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{student.parent_guardian_name}</span>
                    </div>
                  )}

                  {(student.allergies || student.medical_conditions) && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Has medical info</span>
                    </div>
                  )}

                  {student.blood_type && (
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>Blood Type: {student.blood_type}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
