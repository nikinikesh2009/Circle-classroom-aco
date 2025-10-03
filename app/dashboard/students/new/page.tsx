export const dynamic = "force-dynamic"
;("use client")

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function NewStudentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    emergency_contact: "",
    emergency_phone: "",
    medical_notes: "",
    address: "",
  })

  const generateLoginId = (firstName: string, lastName: string) => {
    const random = Math.floor(1000 + Math.random() * 9000)
    return `${firstName.slice(0, 3)}${lastName.slice(0, 3)}${random}`.toUpperCase()
  }

  const generateStudentId = (firstName: string, lastName: string) => {
    const random = Math.floor(100000 + Math.random() * 900000)
    return `${firstName.slice(0, 2)}${lastName.slice(0, 2)}${random}`.toUpperCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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

      const studentId = generateStudentId(formData.first_name, formData.last_name)
      const loginId = generateLoginId(formData.first_name, formData.last_name)

      console.log("[v0] Attempting to insert student with data:", {
        student_id: studentId,
        login_id: loginId,
        classroom_id: classroom.id,
        teacher_id: user.id,
      })

      const { error } = await supabase.from("students").insert({
        student_id: studentId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        parent_guardian_name: formData.parent_name,
        parent_guardian_email: formData.parent_email,
        parent_guardian_phone: formData.parent_phone,
        emergency_contact_name: formData.emergency_contact,
        emergency_contact_phone: formData.emergency_phone,
        medical_conditions: formData.medical_notes,
        address: formData.address,
        classroom_id: classroom.id,
        teacher_id: user.id,
        login_id: loginId,
      })

      if (error) {
        console.log("[v0] Error inserting student:", error)
        throw error
      }

      console.log("[v0] Student inserted successfully")

      toast({
        title: "Success",
        description: `Student registered with Student ID: ${studentId} and Login ID: ${loginId}`,
      })

      router.push("/dashboard/students")
    } catch (error: any) {
      console.log("[v0] Error in handleSubmit:", error)
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
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register New Student
          </CardTitle>
          <CardDescription>
            Add a new student to your classroom. A unique login ID will be generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Parent/Guardian Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="parent_name">Parent Name *</Label>
                  <Input
                    id="parent_name"
                    required
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent_phone">Parent Phone *</Label>
                  <Input
                    id="parent_phone"
                    type="tel"
                    required
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_email">Parent Email</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Emergency Contact</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Emergency Phone</Label>
                  <Input
                    id="emergency_phone"
                    type="tel"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical_notes">Medical Notes</Label>
              <Textarea
                id="medical_notes"
                placeholder="Allergies, medications, special needs..."
                value={formData.medical_notes}
                onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registering..." : "Register Student"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
