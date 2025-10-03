"use client"

import { LandingNav } from "@/components/landing-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  School,
  Users,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Easily manage student profiles, track progress, and organize your classroom efficiently.",
    },
    {
      icon: ClipboardCheck,
      title: "Smart Attendance",
      description: "QR code-based attendance system with real-time tracking and automated reports.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights into student performance and attendance patterns.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with role-based access control and data encryption.",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up and set up your classroom profile in minutes.",
    },
    {
      number: "02",
      title: "Add Students",
      description: "Import or manually add students to your classroom roster.",
    },
    {
      number: "03",
      title: "Start Tracking",
      description: "Use QR codes for attendance and begin monitoring progress.",
    },
    {
      number: "04",
      title: "Analyze & Improve",
      description: "Review reports and insights to enhance student outcomes.",
    },
  ]

  const faqs = [
    {
      question: "How does the QR code attendance system work?",
      answer:
        "Each student gets a unique QR code that they can scan when entering the classroom. The system automatically records their attendance with timestamp and location data.",
    },
    {
      question: "Can I use Circle Classroom for multiple classes?",
      answer:
        "Yes! You can manage multiple classrooms, each with its own students, schedules, and attendance tracking.",
    },
    {
      question: "Is my student data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and follow strict data privacy regulations. All data is stored securely and only accessible to authorized users.",
    },
    {
      question: "What kind of reports can I generate?",
      answer:
        "You can generate attendance reports, performance analytics, progress tracking, and custom reports based on various metrics and time periods.",
    },
    {
      question: "Do students need an account?",
      answer:
        "Students can access their progress through a unique link without creating an account. Teachers and administrators need accounts to manage the system.",
    },
  ]

  return (
    <div className="min-h-screen">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" />
              Modern Classroom Management
            </Badge>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              The complete platform for <span className="text-primary">classroom excellence</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed sm:text-xl">
              Streamline attendance tracking, student management, and performance analytics. Empower educators to focus
              on what matters most—teaching.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-to-use">Learn More</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500+", label: "Teachers" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold sm:text-4xl">
              Everything you need to manage your classroom
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground leading-relaxed">
              Powerful features designed to simplify classroom management and enhance the learning experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-balance text-3xl font-bold sm:text-4xl">About Circle Classroom</h2>
              <div className="space-y-4 text-pretty text-muted-foreground leading-relaxed">
                <p>
                  Circle Classroom is a modern education management platform designed to simplify the daily tasks of
                  educators while providing powerful insights into student performance and engagement.
                </p>
                <p>
                  Built with teachers in mind, our platform combines intuitive design with robust functionality to
                  create a seamless experience for managing classrooms of any size.
                </p>
                <p>
                  We believe that technology should empower educators, not complicate their work. That's why we've
                  created a solution that's both powerful and easy to use.
                </p>
              </div>
              <div className="mt-8 space-y-4">
                {[
                  "Easy-to-use interface designed for educators",
                  "Real-time attendance and performance tracking",
                  "Comprehensive analytics and reporting",
                  "Secure, cloud-based platform",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-pretty leading-relaxed">
                    To empower educators with innovative tools that streamline classroom management, enhance student
                    engagement, and provide actionable insights for improved learning outcomes.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <Clock className="mb-2 h-6 w-6 text-primary" />
                      <div className="text-sm font-medium">Save Time</div>
                      <div className="text-xs text-muted-foreground">Automate routine tasks</div>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-4">
                      <BarChart3 className="mb-2 h-6 w-6 text-primary" />
                      <div className="text-sm font-medium">Gain Insights</div>
                      <div className="text-xs text-muted-foreground">Data-driven decisions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold sm:text-4xl">How to Get Started</h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground leading-relaxed">
              Get up and running in minutes with our simple onboarding process.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4 text-5xl font-bold text-primary/20">{step.number}</div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">{step.description}</CardDescription>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
            <p className="text-pretty text-muted-foreground leading-relaxed">
              Find answers to common questions about Circle Classroom.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-balance">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-pretty text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Forum Section */}
      <section id="forum" className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-balance text-3xl font-bold sm:text-4xl">Join Our Community</h2>
              <p className="mb-6 text-pretty text-muted-foreground leading-relaxed">
                Connect with other educators, share best practices, and get help from our community of teachers and
                administrators.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MessageSquare, title: "Discussion Forums", desc: "Ask questions and share experiences" },
                  { icon: Users, title: "Teacher Network", desc: "Connect with educators worldwide" },
                  { icon: HelpCircle, title: "Knowledge Base", desc: "Access guides and tutorials" },
                ].map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.desc}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Instant Help Center</CardTitle>
                <CardDescription>Get immediate assistance from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our support team is available 24/7 to help you with any questions or issues you may encounter.
                </p>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                    Start Live Chat
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </Button>
                  <Button className="w-full justify-start gap-2 bg-transparent" variant="outline">
                    <HelpCircle className="h-4 w-4" />
                    Browse Help Articles
                  </Button>
                </div>
                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="mb-2 text-sm font-medium">Average Response Time</div>
                  <div className="text-2xl font-bold text-primary">{"< 2 minutes"}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-balance text-3xl font-bold sm:text-4xl">Get in Touch</h2>
              <p className="mb-8 text-pretty text-muted-foreground leading-relaxed">
                Have questions or need assistance? We're here to help. Reach out to us through any of the channels
                below.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Mail, title: "Email", value: "support@circleclassroom.com" },
                  { icon: Phone, title: "Phone", value: "+1 (555) 123-4567" },
                  { icon: MapPin, title: "Office", value: "123 Education St, Learning City, ED 12345" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-balance text-3xl font-bold sm:text-4xl">Ready to transform your classroom?</h2>
          <p className="mb-8 text-pretty text-lg text-primary-foreground/90 leading-relaxed">
            Join thousands of educators who are already using Circle Classroom to streamline their workflow and enhance
            student success.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/auth/sign-up">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <School className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Circle Classroom</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern classroom management for the digital age.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2025 Circle Classroom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
