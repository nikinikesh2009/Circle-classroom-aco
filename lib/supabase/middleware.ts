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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] Middleware - User check:", {
      hasUser: !!user,
      isProtectedRoute,
      isAuthRoute,
      pathname: request.nextUrl.pathname,
      error: userError?.message,
    })

    if (!user && isProtectedRoute) {
      console.log("[v0] Redirecting to login - no user on protected route")
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (user && isAuthRoute && !request.nextUrl.pathname.includes("/callback")) {
      console.log("[v0] User on auth route, checking classroom")
      const classroomPromise = supabase.from("classrooms").select("id").eq("teacher_id", user.id).maybeSingle()

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ data: null }), 3000))

      const { data: classroom } = (await Promise.race([classroomPromise, timeoutPromise])) as any

      const url = request.nextUrl.clone()
      url.pathname = classroom ? "/dashboard" : "/setup"
      console.log("[v0] Redirecting to:", url.pathname)
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("[v0] Middleware auth error:", error)
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
