"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, MoreVertical, Edit, Trash2, QrCode } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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

  const filteredStudents = students.filter(
    (student) =>
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.login_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">Manage your student roster • {students.length} total students</p>
        </div>
        <Link href="/dashboard/students/new">
          <Button size="lg" className="gap-2">
            <UserPlus className="h-5 w-5" />
            Add Student
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16">
          <UserPlus className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No students found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term" : "Get started by adding your first student"}
          </p>
          {!searchTerm && (
            <Link href="/dashboard/students/new">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.photo_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {student.first_name} {student.last_name}
                      </span>
                      {student.parent_guardian_name && (
                        <span className="text-xs text-muted-foreground">Parent: {student.parent_guardian_name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">{student.student_id}</span>
                  </TableCell>
                  <TableCell>
                    {student.grade_level ? (
                      <Badge variant="secondary" className="font-medium">
                        {student.grade_level}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/students/${student.id}`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="mr-2 h-4 w-4" />
                          Generate QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Student
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

      <Link href="/dashboard/students/new" className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button size="lg" className="h-14 w-14 rounded-full p-0 shadow-lg">
          <UserPlus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
