import type { ReactNode } from "react"
import { useThemeContext } from "@/context/theme-context"

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  bgColor?: string
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  bgColor = "bg-white dark:bg-slate-950",
}: SectionWrapperProps) {
  const { margin, padding } = useThemeContext()

  // Apply margin and padding based on theme settings
  const sectionClasses = `${bgColor} px-${padding} py-${padding} md:py-${Number.parseInt(padding) * 2} m-${margin} ${className}`

  return (
    <section id={id} className={sectionClasses}>
      <div className="container">{children}</div>
    </section>
  )
}
