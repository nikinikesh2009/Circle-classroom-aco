import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LandingNav } from "@/components/landing-nav"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, CheckCircle2, MessageSquare, BookOpen, Users, Zap, Shield, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNav />

      {/* Hero Section */}
      <section className="container flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            The complete platform to build the web.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web
            experiences with our platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="#about">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-px border border-border/40 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card p-8 text-center">
            <div className="text-4xl font-bold">20 days</div>
            <div className="mt-2 text-sm text-muted-foreground">saved on daily builds</div>
          </div>
          <div className="bg-card p-8 text-center">
            <div className="text-4xl font-bold">98%</div>
            <div className="mt-2 text-sm text-muted-foreground">faster time to market</div>
          </div>
          <div className="bg-card p-8 text-center">
            <div className="text-4xl font-bold">300%</div>
            <div className="mt-2 text-sm text-muted-foreground">increase in SEO</div>
          </div>
          <div className="bg-card p-8 text-center">
            <div className="text-4xl font-bold">6x</div>
            <div className="mt-2 text-sm text-muted-foreground">faster to build + deploy</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Faster iteration. More innovation.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              The platform for rapid progress. Let your team focus on shipping features instead of managing
              infrastructure with automated CI/CD, built-in testing, and integrated collaboration.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40">
              <CardHeader>
                <Zap className="mb-2 h-8 w-8" />
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Deploy in seconds with our optimized infrastructure and global edge network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Shield className="mb-2 h-8 w-8" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Built-in security features and compliance certifications to keep your data safe.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Globe className="mb-2 h-8 w-8" />
                <CardTitle>Global Scale</CardTitle>
                <CardDescription>
                  Automatically scale to millions of users with our distributed infrastructure.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">How to Use</h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-bold">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up for free and connect your repository. No credit card required to get started.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-bold">Deploy Your Project</h3>
                <p className="text-muted-foreground">
                  Import your code from GitHub, GitLab, or Bitbucket. We'll automatically detect your framework and
                  configure everything.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-bold">Scale with Confidence</h3>
                <p className="text-muted-foreground">
                  Your site is live! Monitor performance, collaborate with your team, and scale automatically as you
                  grow.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Building Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Frequently Asked Questions</h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Everything you need to know about our platform.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">What frameworks do you support?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We support all major frameworks including Next.js, React, Vue, Svelte, Angular, and more. Our platform
                automatically detects your framework and configures the optimal build settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">How does pricing work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We offer a free tier for personal projects and hobby sites. For teams and production applications, we
                have flexible plans that scale with your usage. You only pay for what you use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Can I use my own domain?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! You can connect custom domains to any project. We provide automatic SSL certificates and handle all
                DNS configuration for you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">What about database and backend services?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our platform integrates seamlessly with popular database providers and backend services. You can also
                deploy serverless functions and API routes alongside your frontend.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Our free tier is available indefinitely for personal projects. You can upgrade to a paid plan at
                any time as your needs grow.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">How do I migrate my existing site?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Migration is simple! Just connect your repository and we'll handle the rest. Our documentation includes
                step-by-step guides for migrating from other platforms.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Join Our Community</h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Connect with thousands of developers, share knowledge, and get help from our community.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40">
              <CardHeader>
                <MessageSquare className="mb-2 h-8 w-8" />
                <CardTitle>Discussion Forum</CardTitle>
                <CardDescription>
                  Ask questions, share tips, and connect with other developers in our active community forum.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Visit Forum
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <Users className="mb-2 h-8 w-8" />
                <CardTitle>Discord Community</CardTitle>
                <CardDescription>
                  Join our Discord server for real-time chat, events, and direct support from our team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Discord
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8" />
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guides, tutorials, and API references to help you build amazing projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Read Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Center Section */}
      <section className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-border/40 bg-card p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Instant Help Center</h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
                Get immediate assistance with our comprehensive help resources and support team.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Our team is always available to help you succeed.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guides for every feature.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Get instant answers from our support team.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-semibold">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground">Searchable articles covering every topic.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg">Access Help Center</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container px-4 py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">Get in Touch</h2>
            <p className="mx-auto mt-6 text-pretty text-lg text-muted-foreground">
              Have a question or want to learn more? Send us a message and we'll get back to you shortly.
            </p>
          </div>

          <Card className="border-border/40">
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
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
                  <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">Platform</h3>
              <p className="text-sm text-muted-foreground">
                The complete platform to build the web. Fast, secure, and scalable.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
