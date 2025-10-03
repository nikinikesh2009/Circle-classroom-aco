"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
        />
        <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
      </motion.div>
    </main>
  )
}
