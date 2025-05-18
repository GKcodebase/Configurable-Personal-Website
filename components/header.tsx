"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, Settings, X, Edit, Save } from "lucide-react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"
import { useThemeContext } from "@/context/theme-context"
import { useEditContext } from "@/context/edit-context"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()
  const { isDarkMode } = useThemeContext()
  const { isEditMode, toggleEditMode, isDevMode, portfolioData } = useEditContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const navItems = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ]

  // Update document title based on portfolio data
  useEffect(() => {
    if (portfolioData?.title?.title) {
      // Update document title to reflect the portfolio title
      document.title = `${portfolioData.title.title} - Portfolio`
    }
  }, [portfolioData?.title?.title])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="#" className="flex items-center gap-2">
          <span className="text-xl font-bold">{portfolioData?.title?.title || "Home"}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild>
            <Link href="#contact">Get in touch</Link>
          </Button>

          {isDevMode && (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="icon"
              onClick={toggleEditMode}
              title={isEditMode ? "Save changes" : "Edit content"}
            >
              {isEditMode ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ModeToggle />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {isDevMode && (
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="icon"
              onClick={toggleEditMode}
              title={isEditMode ? "Save changes" : "Edit content"}
            >
              {isEditMode ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background">
          <nav className="container flex flex-col p-6">
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Button className="mt-6" onClick={closeMenu} asChild>
              <Link href="#contact">Get in touch</Link>
            </Button>
          </nav>
        </div>
      )}

      {isEditMode && (
        <div className="bg-primary text-primary-foreground py-1 px-4 text-center text-sm">
          Edit mode is active. Click on any content to edit it. Click the save button when you're done.
        </div>
      )}
    </header>
  )
}
