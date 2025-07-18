"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle Theme">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle Theme">
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
