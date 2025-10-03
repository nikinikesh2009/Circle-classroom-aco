import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user has a classroom
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: classroom } = await supabase.from("classrooms").select("id").eq("teacher_id", user.id).maybeSingle()

      if (classroom) {
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
      } else {
        return NextResponse.redirect(new URL("/setup", requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}
