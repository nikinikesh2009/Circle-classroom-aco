import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-violet-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent you a confirmation email. Please click the link in the email to verify your account and continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            After verifying your email, you'll be redirected to set up your classroom.
          </p>
          <Link href="/auth/login" className="text-sm text-violet-600 hover:underline">
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
