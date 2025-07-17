import type { ReactNode } from "react"
import { Icon } from "@iconify/react"

interface SectionWrapperProps {
  id?: string
  children: ReactNode
  className?: string
  bgColor?: string
  icon?: string
  iconColor?: string
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  bgColor = "bg-background",
  icon,
  iconColor,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`${bgColor} py-16 md:py-24 ${className}`}
      style={{
        backgroundColor: bgColor.includes("muted") ? "hsl(var(--muted))" : "hsl(var(--background))",
        paddingTop: "calc(var(--spacing-padding) * 4)",
        paddingBottom: "calc(var(--spacing-padding) * 4)",
        marginTop: "var(--spacing-margin)",
        marginBottom: "var(--spacing-margin)",
      }}
    >
      <div
        className="container relative"
        style={{
          paddingLeft: "var(--spacing-padding)",
          paddingRight: "var(--spacing-padding)",
        }}
      >
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
