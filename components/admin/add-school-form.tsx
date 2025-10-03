"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function AddSchoolForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    admin_email: "",
    admin_name: "",
    subscription_tier: "free",
    max_students: "50",
    max_teachers: "5",
    phone: "",
    address: "",
    billing_email: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("schools").insert({
        name: formData.name,
        admin_email: formData.admin_email,
        admin_name: formData.admin_name || null,
        subscription_tier: formData.subscription_tier,
        max_students: Number.parseInt(formData.max_students),
        max_teachers: Number.parseInt(formData.max_teachers),
        phone: formData.phone || null,
        address: formData.address || null,
        billing_email: formData.billing_email || formData.admin_email,
        status: "active",
      })

      if (error) throw error

      router.push("/admin/schools")
      router.refresh()
    } catch (error) {
      console.error("Error creating school:", error)
      alert("Failed to create school. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Enter the details for the new school</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">School Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Lincoln High School"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email *</Label>
              <Input
                id="admin_email"
                type="email"
                required
                value={formData.admin_email}
                onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                placeholder="admin@school.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_name">Admin Name</Label>
              <Input
                id="admin_name"
                value={formData.admin_name}
                onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription_tier">Subscription Tier *</Label>
              <Select
                value={formData.subscription_tier}
                onValueChange={(value) => setFormData({ ...formData, subscription_tier: value })}
              >
                <SelectTrigger id="subscription_tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_email">Billing Email</Label>
              <Input
                id="billing_email"
                type="email"
                value={formData.billing_email}
                onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
                placeholder="billing@school.edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students *</Label>
              <Input
                id="max_students"
                type="number"
                required
                min="1"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_teachers">Max Teachers *</Label>
              <Input
                id="max_teachers"
                type="number"
                required
                min="1"
                value={formData.max_teachers}
                onChange={(e) => setFormData({ ...formData, max_teachers: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State, ZIP"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create School"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
