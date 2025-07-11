import type React from "react"
import "@/app/globals.css"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/context/theme-context"
import { EditProvider } from "@/context/edit-context"
import { Inter, Roboto, Poppins, Lato } from "next/font/google"
import type { Metadata } from "next"
import Header from "@/components/header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
})

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
})

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${lato.variable}`}
    >
      <body className={inter.className}>
        <NextThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="portfolio-theme"
        >
          <ThemeProvider>
            <EditProvider>
              <div className="theme-application-wrapper min-h-screen">
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
