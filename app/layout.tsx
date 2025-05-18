import type React from "react"
import "@/app/globals.css"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/context/theme-context"
import { EditProvider } from "@/context/edit-context"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio Website",
  description: "Personal portfolio website showcasing skills, projects, and experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ThemeProvider>
            <EditProvider>
              <div className="theme-application-wrapper">
                <Header />
                {children}
              </div>
            </EditProvider>
          </ThemeProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
}
