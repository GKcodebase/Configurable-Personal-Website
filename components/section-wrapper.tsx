import type { ReactNode } from "react"
import { useThemeContext } from "@/context/theme-context"
import { Icon } from "@iconify/react"

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  bgColor?: string
  icon?: string // Optional icon name
  iconColor?: string // Optional icon color
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  bgColor = "bg-background dark:bg-background", // Changed to use CSS variables
  icon,
  iconColor,
}: SectionWrapperProps) {
  const { margin, padding } = useThemeContext()

  // Apply margin and padding based on theme settings
  const sectionClasses = `${bgColor} px-${padding} py-${padding} md:py-${Number.parseInt(padding) * 2} m-${margin} ${className}`

  return (
    <section id={id} className={sectionClasses} style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="container relative">
        {icon && (
          <div className="absolute top-0 right-0 -mt-6 mr-6">
            <Icon icon={icon} style={{ color: iconColor || "currentColor" }} width={32} height={32} />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
