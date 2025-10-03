"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createCustomerPortalSession() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Get the user's profile to find their Stripe customer ID
    const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

    if (!profile?.stripe_customer_id) {
      throw new Error("No Stripe customer found. Please subscribe first.")
    }

    const returnUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yourdomain.com"}/dashboard/settings`
        : `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "http://localhost:3000"}/dashboard/settings`

    // Create a Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    })

    return { url: session.url }
  } catch (error: any) {
    console.error("[v0] Error creating customer portal session:", error)
    throw new Error(error.message || "Failed to create customer portal session")
  }
}
