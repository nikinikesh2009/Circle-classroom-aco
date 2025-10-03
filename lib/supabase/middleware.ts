import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/setup")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth")

  // Skip authentication check for public routes
  if (!isProtectedRoute && !isAuthRoute) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (user && isAuthRoute && !request.nextUrl.pathname.includes("/callback")) {
      const { data: classroom } = await supabase.from("classrooms").select("id").eq("teacher_id", user.id).maybeSingle()

      const url = request.nextUrl.clone()
      url.pathname = classroom ? "/dashboard" : "/setup"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("[v0] Middleware auth error:", error)
    // For protected routes, redirect to login on error
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
