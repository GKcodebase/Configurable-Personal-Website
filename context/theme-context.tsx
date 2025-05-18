"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"

type ThemeType =
  | "netflix"
  | "youtube"
  | "spotify"
  | "snapchat"
  | "steam"
  | "uber"
  | "tiktok"
  | "beach"
  | "mountain"
  | "rainforest"
  | "custom"

type FontFamily = "inter" | "roboto" | "poppins" | "openSans" | "lato"
type FontSize = "sm" | "base" | "lg" | "xl"
type Spacing = "2" | "4" | "6" | "8"

interface ThemeContextType {
  theme: ThemeType
  fontFamily: FontFamily
  fontSize: FontSize
  margin: Spacing
  padding: Spacing
  primaryColor: string
  secondaryColor: string
  isDarkMode: boolean
  setTheme: (theme: ThemeType) => void
  setFontFamily: (fontFamily: FontFamily) => void
  setFontSize: (fontSize: FontSize) => void
  setMargin: (margin: Spacing) => void
  setPadding: (padding: Spacing) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  toggleDarkMode: () => void
}

const defaultThemeContext: ThemeContextType = {
  theme: "custom",
  fontFamily: "inter",
  fontSize: "base",
  margin: "4",
  padding: "4",
  primaryColor: "#3b82f6", // blue-500
  secondaryColor: "#10b981", // emerald-500
  isDarkMode: false,
  setTheme: () => {},
  setFontFamily: () => {},
  setFontSize: () => {},
  setMargin: () => {},
  setPadding: () => {},
  setPrimaryColor: () => {},
  setSecondaryColor: () => {},
  toggleDarkMode: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme()
  const isDarkMode = nextTheme === "dark"

  const [settings, setSettings] =
    useState<
      Omit<
        ThemeContextType,
        | "setTheme"
        | "setFontFamily"
        | "setFontSize"
        | "setMargin"
        | "setPadding"
        | "setPrimaryColor"
        | "setSecondaryColor"
        | "isDarkMode"
        | "toggleDarkMode"
      >
    >(defaultThemeContext)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("portfolioSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings((prevSettings) => ({
          ...prevSettings,
          ...parsedSettings,
        }))
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "portfolioSettings",
      JSON.stringify({
        theme: settings.theme,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        margin: settings.margin,
        padding: settings.padding,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
      }),
    )
  }, [settings])

  const setTheme = (theme: ThemeType) => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const setFontFamily = (fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }))
  }

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }))
  }

  const setMargin = (margin: Spacing) => {
    setSettings((prev) => ({ ...prev, margin }))
  }

  const setPadding = (padding: Spacing) => {
    setSettings((prev) => ({ ...prev, padding }))
  }

  const setPrimaryColor = (primaryColor: string) => {
    setSettings((prev) => ({ ...prev, primaryColor }))
  }

  const setSecondaryColor = (secondaryColor: string) => {
    setSettings((prev) => ({ ...prev, secondaryColor }))
  }

  const toggleDarkMode = () => {
    setNextTheme(isDarkMode ? "light" : "dark")
  }

  useEffect(() => {
    // Ensure this effect only runs in the browser
    if (typeof window === "undefined") return

    const body = document.body
    const root = document.documentElement

    // Apply theme immediately
    const applyTheme = () => {
      console.log("Applying theme:", settings.theme)

      // Remove all theme classes
      body.classList.remove(
        "theme-netflix",
        "theme-youtube",
        "theme-spotify",
        "theme-snapchat",
        "theme-steam",
        "theme-uber",
        "theme-tiktok",
        "theme-beach",
        "theme-mountain",
        "theme-rainforest",
        "theme-custom",
      )

      // Add current theme class
      body.classList.add(`theme-${settings.theme}`)

      // Apply font family
      body.classList.remove("font-inter", "font-roboto", "font-poppins", "font-openSans", "font-lato")
      body.classList.add(`font-${settings.fontFamily}`)

      // Apply font size
      body.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
      body.classList.add(`text-${settings.fontSize}`)

      // Apply theme-specific CSS variables directly to :root
      if (settings.theme === "custom") {
        // Convert hex to hsl for CSS variables
        const primaryHsl = hexToHsl(settings.primaryColor)
        const secondaryHsl = hexToHsl(settings.secondaryColor)

        if (primaryHsl) {
          root.style.setProperty("--primary", primaryHsl)
          const isDarkPrimary = isColorDark(settings.primaryColor)
          root.style.setProperty("--primary-foreground", isDarkPrimary ? "0 0% 100%" : "0 0% 0%")
        }

        if (secondaryHsl) {
          root.style.setProperty("--secondary", secondaryHsl)
          root.style.setProperty("--accent", secondaryHsl)
          const isDarkSecondary = isColorDark(settings.secondaryColor)
          root.style.setProperty("--secondary-foreground", isDarkSecondary ? "0 0% 100%" : "0 0% 0%")
          root.style.setProperty("--accent-foreground", isDarkSecondary ? "0 0% 100%" : "0 0% 0%")
        }
      } else {
        // For predefined themes, apply CSS variables directly
        applyPredefinedThemeVariables(settings.theme, root)
      }

      // Force a repaint to ensure theme changes are applied
      document.body.style.display = "none"
      document.body.offsetHeight // Force a reflow
      document.body.style.display = ""
    }

    // Apply theme immediately and after a short delay to ensure it takes effect
    applyTheme()
    const timeoutId = setTimeout(applyTheme, 100)

    return () => clearTimeout(timeoutId)
  }, [
    settings.theme,
    settings.fontFamily,
    settings.fontSize,
    settings.primaryColor,
    settings.secondaryColor,
    isDarkMode,
  ])

  // Function to apply predefined theme variables directly
  const applyPredefinedThemeVariables = (theme: ThemeType, root: HTMLElement) => {
    // Reset any custom theme variables first
    root.style.removeProperty("--primary")
    root.style.removeProperty("--primary-foreground")
    root.style.removeProperty("--secondary")
    root.style.removeProperty("--secondary-foreground")
    root.style.removeProperty("--accent")
    root.style.removeProperty("--accent-foreground")

    // Apply theme-specific variables
    switch (theme) {
      case "netflix":
        root.style.setProperty("--primary", "0 100% 50%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "220 13% 23%")
        root.style.setProperty("--secondary-foreground", "0 0% 100%")
        root.style.setProperty("--accent", "0 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "youtube":
        root.style.setProperty("--primary", "0 100% 50%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "0 0% 95%")
        root.style.setProperty("--secondary-foreground", "0 0% 0%")
        root.style.setProperty("--accent", "0 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "spotify":
        root.style.setProperty("--primary", "120 100% 50%")
        root.style.setProperty("--primary-foreground", "0 0% 0%")
        root.style.setProperty("--secondary", "160 100% 20%")
        root.style.setProperty("--secondary-foreground", "0 0% 100%")
        root.style.setProperty("--accent", "120 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 0%")
        break
      case "snapchat":
        root.style.setProperty("--primary", "60 100% 50%")
        root.style.setProperty("--primary-foreground", "0 0% 0%")
        root.style.setProperty("--secondary", "0 0% 0%")
        root.style.setProperty("--secondary-foreground", "60 100% 50%")
        root.style.setProperty("--accent", "0 0% 0%")
        root.style.setProperty("--accent-foreground", "60 100% 50%")
        break
      case "steam":
        root.style.setProperty("--primary", "200 100% 50%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "210 100% 20%")
        root.style.setProperty("--secondary-foreground", "0 0% 100%")
        root.style.setProperty("--accent", "200 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "uber":
        root.style.setProperty("--primary", "0 0% 100%")
        root.style.setProperty("--primary-foreground", "0 0% 0%")
        root.style.setProperty("--secondary", "0 0% 15%")
        root.style.setProperty("--secondary-foreground", "0 0% 100%")
        root.style.setProperty("--accent", "0 0% 100%")
        root.style.setProperty("--accent-foreground", "0 0% 0%")
        break
      case "tiktok":
        root.style.setProperty("--primary", "326 100% 60%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "196 100% 50%")
        root.style.setProperty("--secondary-foreground", "0 0% 100%")
        root.style.setProperty("--accent", "196 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "beach":
        root.style.setProperty("--primary", "200 100% 45%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "40 100% 80%")
        root.style.setProperty("--secondary-foreground", "25 100% 25%")
        root.style.setProperty("--accent", "25 100% 60%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "mountain":
        root.style.setProperty("--primary", "210 50% 40%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "210 30% 70%")
        root.style.setProperty("--secondary-foreground", "210 50% 10%")
        root.style.setProperty("--accent", "210 50% 60%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      case "rainforest":
        root.style.setProperty("--primary", "120 50% 30%")
        root.style.setProperty("--primary-foreground", "0 0% 100%")
        root.style.setProperty("--secondary", "80 70% 60%")
        root.style.setProperty("--secondary-foreground", "120 50% 10%")
        root.style.setProperty("--accent", "40 100% 50%")
        root.style.setProperty("--accent-foreground", "0 0% 100%")
        break
      // Default case is handled by the CSS variables in globals.css
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        ...settings,
        isDarkMode,
        setTheme,
        setFontFamily,
        setFontSize,
        setMargin,
        setPadding,
        setPrimaryColor,
        setSecondaryColor,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// Function to convert hex color to HSL format for CSS variables
function hexToHsl(hex: string): string | null {
  // Remove the # if present
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 3) {
    r = Number.parseInt(hex[0] + hex[0], 16)
    g = Number.parseInt(hex[1] + hex[1], 16)
    b = Number.parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = Number.parseInt(hex.substring(0, 2), 16)
    g = Number.parseInt(hex.substring(2, 4), 16)
    b = Number.parseInt(hex.substring(4, 6), 16)
  } else {
    return null
  }

  // Convert RGB to HSL
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // Format as CSS HSL value
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}

// Function to determine if a color is dark (for setting contrasting text)
function isColorDark(hex: string): boolean {
  // Remove the # if present
  hex = hex.replace(/^#/, "")

  // Parse the hex values
  let r = 0,
    g = 0,
    b = 0
  if (hex.length === 3) {
    r = Number.parseInt(hex[0] + hex[0], 16)
    g = Number.parseInt(hex[1] + hex[1], 16)
    b = Number.parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = Number.parseInt(hex.substring(0, 2), 16)
    g = Number.parseInt(hex.substring(2, 4), 16)
    b = Number.parseInt(hex.substring(4, 6), 16)
  } else {
    return false
  }

  // Calculate relative luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b

  // Return true if the color is dark
  return luminance < 128
}
