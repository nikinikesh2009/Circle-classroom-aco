"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  Database,
  Key,
  Megaphone,
  Power,
  RefreshCw,
  Shield,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Announcement = {
  id: string
  title: string
  content: string
  priority: string
  target_audience: string
  active: boolean
  created_at: string
}

type ApiKey = {
  id: string
  key_name: string
  api_key: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

export function SystemControlsPanel({
  announcements,
  apiKeys,
}: {
  announcements: Announcement[]
  apiKeys: ApiKey[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    target_audience: "all",
  })

  const [apiKeyForm, setApiKeyForm] = useState({
    key_name: "",
  })

  const handleCreateAnnouncement = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("system_announcements").insert({
        ...announcementForm,
        active: true,
      })

      if (error) throw error

      setAnnouncementDialogOpen(false)
      setAnnouncementForm({ title: "", content: "", priority: "normal", target_audience: "all" })
      router.refresh()
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Failed to create announcement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateApiKey = async () => {
    setIsLoading(true)
    try {
      // Generate a random API key
      const newApiKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      const { error } = await supabase.from("api_keys").insert({
        key_name: apiKeyForm.key_name,
        api_key: newApiKey,
        is_active: true,
      })

      if (error) throw error

      setApiKeyDialogOpen(false)
      setApiKeyForm({ key_name: "" })
      router.refresh()
    } catch (error) {
      console.error("Error generating API key:", error)
      alert("Failed to generate API key")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleEmergencyLockdown = () => {
    if (confirm("Are you sure you want to initiate emergency lockdown? This will disable all non-admin access.")) {
      alert("Emergency lockdown functionality would be implemented here")
    }
  }

  const handleDatabaseBackup = () => {
    alert("Database backup functionality would be implemented here")
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Emergency Controls */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency Controls
            </CardTitle>
            <CardDescription>Critical platform controls - use with caution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="destructive" className="w-full" onClick={handleEmergencyLockdown}>
              <Power className="mr-2 h-4 w-4" />
              Emergency Lockdown
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Shield className="mr-2 h-4 w-4" />
              Enable Maintenance Mode
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Force System Restart
            </Button>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>Backup and restore operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="default" className="w-full" onClick={handleDatabaseBackup}>
              <Database className="mr-2 h-4 w-4" />
              Create Backup
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore from Backup
            </Button>
            <div className="pt-2 text-sm text-muted-foreground">
              <p>Last backup: 2 hours ago</p>
              <p>Database size: 2.4 GB</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Announcements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                System Announcements
              </CardTitle>
              <CardDescription>Platform-wide notifications for users</CardDescription>
            </div>
            <Button onClick={() => setAnnouncementDialogOpen(true)}>Create Announcement</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No announcements</p>
            ) : (
              announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <Badge
                        variant={
                          announcement.priority === "critical"
                            ? "destructive"
                            : announcement.priority === "high"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {announcement.priority}
                      </Badge>
                      {announcement.active ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Target: {announcement.target_audience} • Created:{" "}
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>Generate and manage API keys for integrations</CardDescription>
            </div>
            <Button onClick={() => setApiKeyDialogOpen(true)}>Generate New Key</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No API keys generated
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.key_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{key.api_key.substring(0, 20)}...</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.api_key, key.id)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedKey === key.id ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {key.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create System Announcement</DialogTitle>
            <DialogDescription>Send a platform-wide notification to users</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                placeholder="Important Update"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                placeholder="Announcement details..."
                rows={4}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={announcementForm.priority}
                  onValueChange={(value) => setAnnouncementForm({ ...announcementForm, priority: value })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={announcementForm.target_audience}
                  onValueChange={(value) => setAnnouncementForm({ ...announcementForm, target_audience: value })}
                >
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="schools">Schools Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>Create a new API key for platform integrations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key_name">Key Name</Label>
              <Input
                id="key_name"
                value={apiKeyForm.key_name}
                onChange={(e) => setApiKeyForm({ ...apiKeyForm, key_name: e.target.value })}
                placeholder="Production API Key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateApiKey} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
