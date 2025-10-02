"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export function CopyButton({ username }: { username: string }) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(`${window.location.origin}/view/${username}`)
  }, [username])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex gap-2">
      <Input readOnly value={url} className="font-mono text-sm" />
      <Button onClick={handleCopy}>Copy</Button>
    </div>
  )
}
