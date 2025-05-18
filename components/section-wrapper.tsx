import type { ReactNode } from "react"
import { useThemeContext } from "@/context/theme-context"
import { Icon } from "@iconify/react" // We'll need to install this package

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
  bgColor = "bg-white dark:bg-slate-950",
  icon,
  iconColor,
}: SectionWrapperProps) {
  const { margin, padding } = useThemeContext()

  // Apply margin and padding based on theme settings
  const sectionClasses = `${bgColor} px-${padding} py-${padding} md:py-${Number.parseInt(padding) * 2} m-${margin} ${className}`

  return (
    <section id={id} className={sectionClasses}>
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
