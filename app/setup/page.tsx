"use client"

import type React from "react"

import { useState } from "react"
import { createClassroom } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SetupPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    classroomName: "",
    username: "",
    gradeLevel: "",
    academicYear: new Date().getFullYear().toString(),
    teacherName: "",
    teacherEmail: "",
    teacherPhone: "",
  })

  const generateUsername = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createClassroom(formData)

      if (result?.error) {
        throw new Error(result.error)
      }

      // If we reach here without redirect, show success and manually redirect
      toast({
        title: "Success!",
        description: "Your classroom has been created.",
      })
    } catch (error: any) {
      setLoading(false)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
            <School className="h-6 w-6 text-violet-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Circle Classroom!</CardTitle>
          <CardDescription>Let's set up your classroom to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Classroom Information</h3>
              <div className="space-y-2">
                <Label htmlFor="classroomName">Classroom Name *</Label>
                <Input
                  id="classroomName"
                  required
                  value={formData.classroomName}
                  onChange={(e) => {
                    setFormData({ ...formData, classroomName: e.target.value })
                    if (!formData.username) {
                      setFormData((prev) => ({
                        ...prev,
                        classroomName: e.target.value,
                        username: generateUsername(e.target.value),
                      }))
                    }
                  }}
                  placeholder="Grade 5 - Mrs. Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Public Username *</Label>
                <Input
                  id="username"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: generateUsername(e.target.value) })}
                  placeholder="grade5smith"
                />
                <p className="text-xs text-muted-foreground">
                  Students and parents will use this to access the public portal
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level *</Label>
                  <Input
                    id="gradeLevel"
                    required
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    placeholder="Grade 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2024-2025"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Teacher Information</h3>
              <div className="space-y-2">
                <Label htmlFor="teacherName">Full Name *</Label>
                <Input
                  id="teacherName"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="Mrs. Jane Smith"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">Email</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={formData.teacherEmail}
                    onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                    placeholder="teacher@school.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherPhone">Phone</Label>
                  <Input
                    id="teacherPhone"
                    type="tel"
                    value={formData.teacherPhone}
                    onChange={(e) => setFormData({ ...formData, teacherPhone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Classroom...
                </>
              ) : (
                "Create Classroom"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
