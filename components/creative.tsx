"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  BookOpen,
  Bookmark,
  Calendar,
  ChevronDown,
  Cloud,
  Crown,
  Download,
  FileText,
  Heart,
  Home,
  Layers,
  Lightbulb,
  Menu,
  MessageSquare,
  PanelLeft,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash,
  TrendingUp,
  Users,
  Clock,
  Eye,
  Archive,
  ArrowUpDown,
  MoreHorizontal,
  X,
  GraduationCap,
  UserCheck,
  Phone,
  QrCode,
  Upload,
  FileSpreadsheet,
  Database,
  Shield,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const apps = [
  {
    name: "Student Profiles",
    icon: <Users className="text-violet-500" />,
    description: "Manage student information, photos, and emergency contacts",
    category: "Management",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "Attendance Tracker",
    icon: <UserCheck className="text-orange-500" />,
    description: "One-click attendance with daily and monthly views",
    category: "Tracking",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "QR Code Generator",
    icon: <QrCode className="text-pink-500" />,
    description: "Generate student QR codes and printable ID cards",
    category: "Tools",
    recent: true,
    new: true,
    progress: 100,
  },
  {
    name: "Reports & Export",
    icon: <FileSpreadsheet className="text-blue-500" />,
    description: "Export attendance and student data to PDF/Excel",
    category: "Reports",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Medical Info",
    icon: <Shield className="text-red-500" />,
    description: "Track student allergies and medical conditions",
    category: "Safety",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Bulk Import",
    icon: <Upload className="text-fuchsia-500" />,
    description: "Import multiple students via CSV file",
    category: "Management",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "Class Roster",
    icon: <BookOpen className="text-teal-500" />,
    description: "Printable class rosters and student lists",
    category: "Reports",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Emergency Contacts",
    icon: <Phone className="text-red-600" />,
    description: "Quick access to parent and guardian information",
    category: "Communication",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Photo Upload",
    icon: <Upload className="text-emerald-500" />,
    description: "Upload and manage student profile photos",
    category: "Management",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Attendance History",
    icon: <Calendar className="text-indigo-500" />,
    description: "View complete attendance records and patterns",
    category: "Analytics",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Data Backup",
    icon: <Database className="text-amber-500" />,
    description: "Backup and restore all classroom data",
    category: "Management",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "Student Search",
    icon: <Search className="text-purple-500" />,
    description: "Quickly find students with advanced filters",
    category: "Tools",
    recent: false,
    new: false,
    progress: 100,
  },
]

const recentFiles = [
  {
    name: "Grade 5A Attendance - March.xlsx",
    app: "Attendance Tracker",
    modified: "2 hours ago",
    icon: <UserCheck className="text-violet-500" />,
    shared: true,
    size: "124 KB",
    collaborators: 3,
  },
  {
    name: "Student QR Codes - Batch 1.pdf",
    app: "QR Code Generator",
    modified: "Yesterday",
    icon: <QrCode className="text-orange-500" />,
    shared: true,
    size: "2.2 MB",
    collaborators: 2,
  },
  {
    name: "Monthly Attendance Report.xlsx",
    app: "Reports & Export",
    modified: "3 days ago",
    icon: <FileSpreadsheet className="text-pink-500" />,
    shared: false,
    size: "856 KB",
    collaborators: 0,
  },
  {
    name: "Emergency Contact List.pdf",
    app: "Emergency Contacts",
    modified: "Last week",
    icon: <Phone className="text-blue-500" />,
    shared: true,
    size: "345 KB",
    collaborators: 4,
  },
  {
    name: "New Students Import.csv",
    app: "Bulk Import",
    modified: "2 weeks ago",
    icon: <Upload className="text-red-500" />,
    shared: false,
    size: "42 KB",
    collaborators: 0,
  },
  {
    name: "Class Roster - Spring 2025.pdf",
    app: "Class Roster",
    modified: "3 weeks ago",
    icon: <BookOpen className="text-fuchsia-500" />,
    shared: true,
    size: "1.3 MB",
    collaborators: 5,
  },
  {
    name: "Student Medical Records.xlsx",
    app: "Medical Info",
    modified: "Last month",
    icon: <Shield className="text-teal-500" />,
    shared: false,
    size: "215 KB",
    collaborators: 0,
  },
]

const projects = [
  {
    name: "Grade 5A - Morning Class",
    description: "32 students with 98% attendance rate",
    progress: 98,
    dueDate: "June 15, 2025",
    members: 32,
    files: 45,
  },
  {
    name: "Grade 6B - Science Lab",
    description: "28 students with complete medical records",
    progress: 95,
    dueDate: "July 30, 2025",
    members: 28,
    files: 38,
  },
  {
    name: "Grade 4C - Art Class",
    description: "30 students with QR codes generated",
    progress: 100,
    dueDate: "May 25, 2025",
    members: 30,
    files: 52,
  },
  {
    name: "Grade 7A - Advanced Math",
    description: "25 students with emergency contacts verified",
    progress: 88,
    dueDate: "August 10, 2025",
    members: 25,
    files: 31,
  },
]

const tutorials = [
  {
    title: "Getting Started with Circle Classroom",
    description: "Learn how to set up your first classroom and add students",
    duration: "15m",
    level: "Beginner",
    instructor: "Sarah Chen",
    category: "Setup",
    views: "24K",
  },
  {
    title: "Mastering Attendance Tracking",
    description: "Best practices for daily attendance and monthly reports",
    duration: "20m",
    level: "Beginner",
    instructor: "Michael Rodriguez",
    category: "Tracking",
    views: "18K",
  },
  {
    title: "QR Code System Deep Dive",
    description: "Generate, print, and use student QR codes effectively",
    duration: "25m",
    level: "Intermediate",
    instructor: "James Wilson",
    category: "Tools",
    views: "32K",
  },
  {
    title: "Bulk Student Import Guide",
    description: "Import hundreds of students quickly using CSV files",
    duration: "18m",
    level: "Intermediate",
    instructor: "Emma Thompson",
    category: "Management",
    views: "15K",
  },
  {
    title: "Data Backup & Security",
    description: "Keep your classroom data safe with proper backups",
    duration: "22m",
    level: "Advanced",
    instructor: "David Kim",
    category: "Security",
    views: "21K",
  },
]

const communityPosts = [
  {
    title: "Creative Use of QR Codes for Field Trips",
    author: "Maria Garcia",
    image: "/images/community/field-trip-qr.jpg",
    likes: 150,
    comments: 25,
    time: "2 days ago",
  },
  {
    title: "Innovative Attendance Tracking Methods",
    author: "John Smith",
    image: "/images/community/attendance-innovations.jpg",
    likes: 200,
    comments: 30,
    time: "1 week ago",
  },
  {
    title: "Designing Engaging Student ID Cards",
    author: "Sophia Lee",
    image: "/images/community/student-id-design.jpg",
    likes: 180,
    comments: 28,
    time: "3 days ago",
  },
  {
    title: "Tips for Smooth Parent Communication via App",
    author: "David Brown",
    image: "/images/community/parent-communication.jpg",
    likes: 120,
    comments: 15,
    time: "5 days ago",
  },
]

const sidebarItems = [
  {
    title: "Home",
    icon: <Home />,
    isActive: true,
  },
  {
    title: "Students",
    icon: <Users />,
    badge: "32",
    items: [
      { title: "All Students", url: "#" },
      { title: "Add New", url: "#" },
      { title: "Bulk Import", url: "#", badge: "New" },
      { title: "Medical Info", url: "#" },
    ],
  },
  {
    title: "Attendance",
    icon: <UserCheck />,
    items: [
      { title: "Today's Attendance", url: "#" },
      { title: "Monthly View", url: "#" },
      { title: "History", url: "#" },
      { title: "Reports", url: "#", badge: "3" },
    ],
  },
  {
    title: "QR Codes",
    icon: <QrCode />,
    badge: "New",
    items: [
      { title: "Generate Codes", url: "#" },
      { title: "Print ID Cards", url: "#" },
      { title: "Bulk Print", url: "#" },
    ],
  },
  {
    title: "Reports",
    icon: <FileSpreadsheet />,
    items: [
      { title: "Attendance Summary", url: "#" },
      { title: "Export to PDF", url: "#" },
      { title: "Export to Excel", url: "#" },
      { title: "Class Rosters", url: "#" },
    ],
  },
  {
    title: "Data",
    icon: <Database />,
    items: [
      { title: "Backup Data", url: "#" },
      { title: "Restore Data", url: "#" },
      { title: "Export All", url: "#" },
    ],
  },
  {
    title: "Resources",
    icon: <Bookmark />,
    items: [
      { title: "Tutorials", url: "#" },
      { title: "Guides", url: "#" },
      { title: "Support", url: "#" },
    ],
  },
]

export function DesignaliCreative() {
  const [progress, setProgress] = useState(0)
  const [notifications, setNotifications] = useState(5)
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">Circle Classroom</h2>
                <p className="text-xs text-muted-foreground">Student Management</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => item.items && toggleExpanded(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "ml-2 h-4 w-4 transition-transform",
                          expandedItems[item.title] ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </button>

                  {item.items && expandedItems[item.title] && (
                    <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.url}
                          className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                        >
                          {subItem.title}
                          {subItem.badge && (
                            <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                              {subItem.badge}
                            </Badge>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <span>Teacher</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 text-white">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">Circle Classroom</h2>
                <p className="text-xs text-muted-foreground">Student Management</p>
              </div>
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                      item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                    onClick={() => item.items && toggleExpanded(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "ml-2 h-4 w-4 transition-transform",
                          expandedItems[item.title] ? "rotate-180" : "",
                        )}
                      />
                    )}
                  </button>

                  {item.items && expandedItems[item.title] && (
                    <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem.title}
                          href={subItem.url}
                          className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                        >
                          {subItem.title}
                          {subItem.badge && (
                            <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                              {subItem.badge}
                            </Badge>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <span>Teacher</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Pro
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Circle Classroom</h1>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Cloud className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cloud Backup</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Messages</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                          {notifications}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-full max-w-[600px] grid-cols-5 rounded-2xl p-1">
                <TabsTrigger value="home" className="rounded-xl data-[state=active]:rounded-xl">
                  Home
                </TabsTrigger>
                <TabsTrigger value="apps" className="rounded-xl data-[state=active]:rounded-xl">
                  Tools
                </TabsTrigger>
                <TabsTrigger value="files" className="rounded-xl data-[state=active]:rounded-xl">
                  Files
                </TabsTrigger>
                <TabsTrigger value="projects" className="rounded-xl data-[state=active]:rounded-xl">
                  Classes
                </TabsTrigger>
                <TabsTrigger value="learn" className="rounded-xl data-[state=active]:rounded-xl">
                  Learn
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:flex gap-2">
                <Button variant="outline" className="rounded-2xl bg-transparent">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Codes
                </Button>
                <Button className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                          <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                            World's First E-Classroom Manager
                          </Badge>
                          <h2 className="text-3xl font-bold">Welcome to Circle Classroom</h2>
                          <p className="max-w-[600px] text-white/80">
                            Manage student profiles, track attendance with one click, generate QR codes, and export
                            comprehensive reports. Everything you need for efficient classroom management.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Students
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                            >
                              Watch Demo
                            </Button>
                          </div>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="relative h-40 w-40"
                          >
                            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                            <div className="absolute inset-4 rounded-full bg-white/20" />
                            <div className="absolute inset-8 rounded-full bg-white/30" />
                            <div className="absolute inset-12 rounded-full bg-white/40" />
                            <div className="absolute inset-16 rounded-full bg-white/50" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Quick Access Tools</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        View All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {apps
                        .filter((app) => app.recent)
                        .map((app) => (
                          <motion.div key={app.name} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                    {app.icon}
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-2xl">
                                    <Star className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <CardTitle className="text-lg">{app.name}</CardTitle>
                                <CardDescription>{app.description}</CardDescription>
                              </CardContent>
                              <CardFooter>
                                <Button variant="secondary" className="w-full rounded-2xl">
                                  Open
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </section>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Recent Activity</h2>
                        <Button variant="ghost" className="rounded-2xl">
                          View All
                        </Button>
                      </div>
                      <div className="rounded-3xl border">
                        <div className="grid grid-cols-1 divide-y">
                          {recentFiles.slice(0, 4).map((file) => (
                            <motion.div
                              key={file.name}
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                              className="flex items-center justify-between p-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                                  {file.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {file.app} • {file.modified}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.shared && (
                                  <Badge variant="outline" className="rounded-xl">
                                    <Users className="mr-1 h-3 w-3" />
                                    {file.collaborators}
                                  </Badge>
                                )}
                                <Button variant="ghost" size="sm" className="rounded-xl">
                                  Open
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Active Classes</h2>
                        <Button variant="ghost" className="rounded-2xl">
                          View All
                        </Button>
                      </div>
                      <div className="rounded-3xl border">
                        <div className="grid grid-cols-1 divide-y">
                          {projects.slice(0, 3).map((project) => (
                            <motion.div
                              key={project.name}
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                              className="p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{project.name}</h3>
                                <Badge variant="outline" className="rounded-xl">
                                  {project.progress}% Complete
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Class Progress</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2 rounded-xl" />
                              </div>
                              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  {project.members} students
                                </div>
                                <div className="flex items-center">
                                  <FileText className="mr-1 h-4 w-4" />
                                  {project.files} files
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Community Showcase</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        Explore
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {communityPosts.map((post) => (
                        <motion.div key={post.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl">
                            <div className="aspect-[4/3] overflow-hidden bg-muted">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">by {post.author}</p>
                              <div className="mt-2 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  {post.likes}
                                  <MessageSquare className="ml-2 h-4 w-4 text-blue-500" />
                                  {post.comments}
                                </div>
                                <span className="text-muted-foreground">{post.time}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="apps" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Student Management Tools</h2>
                          <p className="max-w-[600px] text-white/80">
                            Everything you need to manage students, track attendance, and generate reports.
                          </p>
                        </div>
                        <Button className="w-fit rounded-2xl bg-white text-teal-700 hover:bg-white/90">
                          <Download className="mr-2 h-4 w-4" />
                          Export Data
                        </Button>
                      </div>
                    </motion.div>
                  </section>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      All Categories
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      Management
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      Tracking
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      Reports
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      Tools
                    </Button>
                    <div className="flex-1"></div>
                    <div className="relative w-full md:w-auto mt-3 md:mt-0">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search tools..."
                        className="w-full rounded-2xl pl-9 md:w-[200px]"
                      />
                    </div>
                  </div>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">New Features</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {apps
                        .filter((app) => app.new)
                        .map((app) => (
                          <motion.div key={app.name} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                            <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                    {app.icon}
                                  </div>
                                  <Badge className="rounded-xl bg-amber-500">New</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <CardTitle className="text-lg">{app.name}</CardTitle>
                                <CardDescription>{app.description}</CardDescription>
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Setup</span>
                                    <span>{app.progress}%</span>
                                  </div>
                                  <Progress value={app.progress} className="h-2 mt-1 rounded-xl" />
                                </div>
                              </CardContent>
                              <CardFooter>
                                <Button variant="secondary" className="w-full rounded-2xl">
                                  {app.progress < 100 ? "Complete Setup" : "Open"}
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">All Tools</h2>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {apps.map((app) => (
                        <motion.div key={app.name} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                  {app.icon}
                                </div>
                                <Badge variant="outline" className="rounded-xl">
                                  {app.category}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <CardTitle className="text-lg">{app.name}</CardTitle>
                              <CardDescription>{app.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              <Button variant="secondary" className="flex-1 rounded-2xl">
                                Open
                              </Button>
                              <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
                                <Star className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="files" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Your Classroom Files</h2>
                          <p className="max-w-[600px] text-white/80">
                            Access attendance records, student data, QR codes, and reports all in one place.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button className="rounded-2xl bg-white/20 backdrop-blur-md hover:bg-white/30">
                            <Cloud className="mr-2 h-4 w-4" />
                            Cloud Backup
                          </Button>
                          <Button className="rounded-2xl bg-white text-blue-700 hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Files
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <FileText className="mr-2 h-4 w-4" />
                      All Files
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Clock className="mr-2 h-4 w-4" />
                      Recent
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Users className="mr-2 h-4 w-4" />
                      Shared
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Star className="mr-2 h-4 w-4" />
                      Favorites
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Trash className="mr-2 h-4 w-4" />
                      Trash
                    </Button>
                    <div className="flex-1"></div>
                    <div className="relative w-full md:w-auto mt-3 md:mt-0">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search files..."
                        className="w-full rounded-2xl pl-9 md:w-[200px]"
                      />
                    </div>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">All Files</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-2xl bg-transparent">
                          <PanelLeft className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-2xl bg-transparent">
                          <ArrowUpDown className="mr-2 h-4 w-4" />
                          Sort
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-3xl border overflow-hidden">
                      <div className="bg-muted/50 p-3 hidden md:grid md:grid-cols-12 text-sm font-medium">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-2">Tool</div>
                        <div className="col-span-2">Size</div>
                        <div className="col-span-2">Modified</div>
                      </div>
                      <div className="divide-y">
                        {recentFiles.map((file) => (
                          <motion.div
                            key={file.name}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="p-3 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-3 md:gap-0"
                          >
                            <div className="col-span-6 flex items-center gap-3 w-full md:w-auto">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                                {file.icon}
                              </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                {file.shared && (
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Users className="mr-1 h-3 w-3" />
                                    Shared with {file.collaborators} people
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2 text-sm md:text-base">{file.app}</div>
                            <div className="col-span-2 text-sm md:text-base">{file.size}</div>
                            <div className="col-span-2 flex items-center justify-between w-full md:w-auto">
                              <span className="text-sm md:text-base">{file.modified}</span>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="projects" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Class Management</h2>
                          <p className="max-w-[600px] text-white/80">
                            Organize and track all your classes with detailed student information and attendance
                            records.
                          </p>
                        </div>
                        <Button className="w-fit rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                          <Plus className="mr-2 h-4 w-4" />
                          New Class
                        </Button>
                      </div>
                    </motion.div>
                  </section>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Layers className="mr-2 h-4 w-4" />
                      All Classes
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Clock className="mr-2 h-4 w-4" />
                      Active
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Archive className="mr-2 h-4 w-4" />
                      Archived
                    </Button>
                    <div className="flex-1"></div>
                    <div className="relative w-full md:w-auto mt-3 md:mt-0">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search classes..."
                        className="w-full rounded-2xl pl-9 md:w-[200px]"
                      />
                    </div>
                  </div>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Active Classes</h2>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {projects.map((project) => (
                        <motion.div key={project.name} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle>{project.name}</CardTitle>
                                <Badge variant="outline" className="rounded-xl">
                                  {project.progress}%
                                </Badge>
                              </div>
                              <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Completion</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2 rounded-xl" />
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Users className="mr-1 h-4 w-4" />
                                  {project.members} students
                                </div>
                                <div className="flex items-center">
                                  <FileText className="mr-1 h-4 w-4" />
                                  {project.files} files
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              <Button variant="secondary" className="flex-1 rounded-2xl">
                                Open Class
                              </Button>
                              <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                      <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                        <Card className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed p-8 hover:border-primary/50 transition-all duration-300">
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Plus className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-medium">Create New Class</h3>
                          <p className="mb-4 text-center text-sm text-muted-foreground">
                            Start managing a new classroom with students and attendance
                          </p>
                          <Button className="rounded-2xl">New Class</Button>
                        </Card>
                      </motion.div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="learn" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Learn Circle Classroom</h2>
                          <p className="max-w-[600px] text-white/80">
                            Master student management with our comprehensive tutorials and guides.
                          </p>
                        </div>
                        <Button className="w-fit rounded-2xl bg-white text-emerald-700 hover:bg-white/90">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                      </div>
                    </motion.div>
                  </section>

                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Play className="mr-2 h-4 w-4" />
                      All Tutorials
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Guides
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Tips & Tricks
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Popular
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Saved
                    </Button>
                    <div className="flex-1"></div>
                    <div className="relative w-full md:w-auto mt-3 md:mt-0">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search tutorials..."
                        className="w-full rounded-2xl pl-9 md:w-[200px]"
                      />
                    </div>
                  </div>

                  <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">Featured Tutorials</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {tutorials.slice(0, 3).map((tutorial) => (
                        <motion.div key={tutorial.title} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                          <Card className="overflow-hidden rounded-3xl">
                            <div className="aspect-video overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button size="icon" variant="secondary" className="h-14 w-14 rounded-full">
                                  <Play className="h-6 w-6" />
                                </Button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                                <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                                  {tutorial.category}
                                </Badge>
                                <h3 className="mt-2 text-lg font-medium">{tutorial.title}</h3>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{tutorial.instructor.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{tutorial.instructor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {tutorial.duration}
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t p-4">
                              <Badge variant="outline" className="rounded-xl">
                                {tutorial.level}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Eye className="h-4 w-4" />
                                {tutorial.views} views
                              </div>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Quick Start Guides</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        View All
                      </Button>
                    </div>
                    <div className="rounded-3xl border overflow-hidden">
                      <div className="divide-y">
                        {tutorials.slice(3, 5).map((tutorial) => (
                          <motion.div
                            key={tutorial.title}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="p-4 flex flex-col md:flex-row gap-3"
                          >
                            <div className="flex-shrink-0">
                              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{tutorial.title}</h3>
                              <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="rounded-xl">
                                  {tutorial.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {tutorial.duration}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  {tutorial.views} views
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                Watch Now
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
