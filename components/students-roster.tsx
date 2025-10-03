"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, MoreVertical, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | null>>(
    students.reduce((acc, student) => ({ ...acc, [student.id]: null }), {}),
  )

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.login_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleAttendance = (studentId: string, status: "present" | "absent") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Students</h2>
          <p className="text-muted-foreground">Manage your student roster</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/20">
          <UserPlus className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Get started by adding your first student"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={student.photo_url || undefined} />
                      <AvatarFallback>
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{student.student_id}</TableCell>
                  <TableCell>
                    {student.grade_level ? (
                      <Badge variant="secondary">{student.grade_level}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "present" ? "default" : "outline"}
                        onClick={() => toggleAttendance(student.id, "present")}
                        className={
                          attendance[student.id] === "present" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"
                        }
                      >
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendance[student.id] === "absent" ? "default" : "outline"}
                        onClick={() => toggleAttendance(student.id, "absent")}
                        className={
                          attendance[student.id] === "absent" ? "bg-red-600 hover:bg-red-700" : "hover:bg-red-50"
                        }
                      >
                        Absent
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/students/${student.id}`} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Link href="/dashboard/students/new" className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="rounded-full shadow-lg h-14 w-14 p-0">
          <UserPlus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  )
}
