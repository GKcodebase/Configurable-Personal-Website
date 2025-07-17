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
    if (typeof window === "undefined") return

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
    if (typeof window === "undefined") return

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

  // Apply theme changes to the DOM
  useEffect(() => {
    if (typeof window === "undefined") return

    const root = document.documentElement

    // Apply theme class with force
    root.classList.remove(
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

    // Force reflow to ensure class removal takes effect
    root.offsetHeight

    root.classList.add(`theme-${settings.theme}`)

    // Apply font family
    root.classList.remove("font-inter", "font-roboto", "font-poppins", "font-openSans", "font-lato")
    root.classList.add(`font-${settings.fontFamily}`)

    // Apply font size to body
    document.body.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
    document.body.classList.add(`text-${settings.fontSize}`)

    // Apply theme variables based on both theme and dark mode
    if (settings.theme !== "custom") {
      applyPredefinedThemeVariables(settings.theme, root, isDarkMode)
    } else {
      // Apply custom colors for custom theme
      const primaryHsl = hexToHsl(settings.primaryColor)
      const secondaryHsl = hexToHsl(settings.secondaryColor)

      if (primaryHsl) {
        root.style.setProperty("--primary", primaryHsl, "important")
        const isDarkPrimary = isColorDark(settings.primaryColor)
        root.style.setProperty("--primary-foreground", isDarkPrimary ? "0 0% 100%" : "0 0% 0%", "important")
      }

      if (secondaryHsl) {
        root.style.setProperty("--secondary", secondaryHsl, "important")
        root.style.setProperty("--accent", secondaryHsl, "important")
        const isDarkSecondary = isColorDark(settings.secondaryColor)
        root.style.setProperty("--secondary-foreground", isDarkSecondary ? "0 0% 100%" : "0 0% 0%", "important")
        root.style.setProperty("--accent-foreground", isDarkSecondary ? "0 0% 100%" : "0 0% 0%", "important")
      }
    }

    // Apply spacing classes to body
    document.body.style.setProperty("--spacing-margin", `${Number.parseInt(settings.margin) * 0.25}rem`)
    document.body.style.setProperty("--spacing-padding", `${Number.parseInt(settings.padding) * 0.25}rem`)

    // Force a repaint to ensure styles are applied
    document.body.style.display = "none"
    document.body.offsetHeight
    document.body.style.display = ""
  }, [settings, isDarkMode])

  // Function to apply predefined theme variables directly with dark mode support
  const applyPredefinedThemeVariables = (theme: ThemeType, root: HTMLElement, isDark: boolean) => {
    // Reset any custom theme variables first
    const cssVars = [
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--accent",
      "--accent-foreground",
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--muted",
      "--muted-foreground",
      "--border",
      "--input",
      "--ring",
    ]

    cssVars.forEach((cssVar) => {
      root.style.removeProperty(cssVar)
    })

    // Apply theme-specific variables with !important flag
    const setThemeVar = (property: string, value: string) => {
      root.style.setProperty(property, value, "important")
    }

    // Apply theme-specific variables based on theme and dark mode
    switch (theme) {
      case "netflix":
        if (isDark) {
          setThemeVar("--background", "220 13% 8%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "220 13% 13%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "0 100% 55%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "220 13% 18%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "220 13% 18%")
          setThemeVar("--muted-foreground", "0 0% 60%")
          setThemeVar("--accent", "0 100% 55%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "220 13% 18%")
          setThemeVar("--input", "220 13% 18%")
        } else {
          setThemeVar("--background", "220 13% 13%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "220 13% 18%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "0 100% 50%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "220 13% 23%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "220 13% 23%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "0 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "220 13% 23%")
          setThemeVar("--input", "220 13% 23%")
        }
        break
      case "youtube":
        if (isDark) {
          setThemeVar("--background", "0 0% 7%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "0 0% 12%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "0 100% 55%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "0 0% 17%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 17%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "0 100% 55%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "0 0% 17%")
          setThemeVar("--input", "0 0% 17%")
        } else {
          setThemeVar("--background", "0 0% 100%")
          setThemeVar("--foreground", "0 0% 0%")
          setThemeVar("--card", "0 0% 98%")
          setThemeVar("--card-foreground", "0 0% 0%")
          setThemeVar("--primary", "0 100% 50%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "0 0% 95%")
          setThemeVar("--secondary-foreground", "0 0% 0%")
          setThemeVar("--muted", "0 0% 95%")
          setThemeVar("--muted-foreground", "0 0% 40%")
          setThemeVar("--accent", "0 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "0 0% 90%")
          setThemeVar("--input", "0 0% 90%")
        }
        break
      case "spotify":
        if (isDark) {
          setThemeVar("--background", "160 100% 5%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "160 100% 8%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "120 100% 55%")
          setThemeVar("--primary-foreground", "0 0% 0%")
          setThemeVar("--secondary", "160 100% 12%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "160 100% 12%")
          setThemeVar("--muted-foreground", "0 0% 60%")
          setThemeVar("--accent", "120 100% 55%")
          setThemeVar("--accent-foreground", "0 0% 0%")
          setThemeVar("--border", "160 100% 12%")
          setThemeVar("--input", "160 100% 12%")
        } else {
          setThemeVar("--background", "160 100% 10%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "160 100% 14%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "120 100% 50%")
          setThemeVar("--primary-foreground", "0 0% 0%")
          setThemeVar("--secondary", "160 100% 20%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "160 100% 20%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "120 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 0%")
          setThemeVar("--border", "160 100% 20%")
          setThemeVar("--input", "160 100% 20%")
        }
        break
      case "snapchat":
        if (isDark) {
          setThemeVar("--background", "0 0% 8%")
          setThemeVar("--foreground", "60 100% 90%")
          setThemeVar("--card", "0 0% 12%")
          setThemeVar("--card-foreground", "60 100% 90%")
          setThemeVar("--primary", "60 100% 60%")
          setThemeVar("--primary-foreground", "0 0% 0%")
          setThemeVar("--secondary", "60 100% 20%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 15%")
          setThemeVar("--muted-foreground", "60 100% 70%")
          setThemeVar("--accent", "60 100% 60%")
          setThemeVar("--accent-foreground", "0 0% 0%")
          setThemeVar("--border", "0 0% 20%")
          setThemeVar("--input", "0 0% 20%")
        } else {
          setThemeVar("--background", "60 100% 95%")
          setThemeVar("--foreground", "0 0% 0%")
          setThemeVar("--card", "60 100% 98%")
          setThemeVar("--card-foreground", "0 0% 0%")
          setThemeVar("--primary", "60 100% 50%")
          setThemeVar("--primary-foreground", "0 0% 0%")
          setThemeVar("--secondary", "0 0% 0%")
          setThemeVar("--secondary-foreground", "60 100% 50%")
          setThemeVar("--muted", "60 100% 90%")
          setThemeVar("--muted-foreground", "0 0% 40%")
          setThemeVar("--accent", "0 0% 0%")
          setThemeVar("--accent-foreground", "60 100% 50%")
          setThemeVar("--border", "60 100% 85%")
          setThemeVar("--input", "60 100% 85%")
        }
        break
      case "steam":
        if (isDark) {
          setThemeVar("--background", "210 100% 5%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "210 100% 8%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "200 100% 60%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "210 100% 12%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "210 100% 12%")
          setThemeVar("--muted-foreground", "0 0% 60%")
          setThemeVar("--accent", "200 100% 60%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "210 100% 12%")
          setThemeVar("--input", "210 100% 12%")
        } else {
          setThemeVar("--background", "210 100% 10%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "210 100% 15%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "200 100% 50%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "210 100% 20%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "210 100% 20%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "200 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "210 100% 20%")
          setThemeVar("--input", "210 100% 20%")
        }
        break
      case "uber":
        if (isDark) {
          setThemeVar("--background", "0 0% 3%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "0 0% 6%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "0 0% 90%")
          setThemeVar("--primary-foreground", "0 0% 10%")
          setThemeVar("--secondary", "0 0% 10%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 10%")
          setThemeVar("--muted-foreground", "0 0% 60%")
          setThemeVar("--accent", "0 0% 90%")
          setThemeVar("--accent-foreground", "0 0% 10%")
          setThemeVar("--border", "0 0% 10%")
          setThemeVar("--input", "0 0% 10%")
        } else {
          setThemeVar("--background", "0 0% 0%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "0 0% 10%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "0 0% 100%")
          setThemeVar("--primary-foreground", "0 0% 0%")
          setThemeVar("--secondary", "0 0% 15%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 15%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "0 0% 100%")
          setThemeVar("--accent-foreground", "0 0% 0%")
          setThemeVar("--border", "0 0% 15%")
          setThemeVar("--input", "0 0% 15%")
        }
        break
      case "tiktok":
        if (isDark) {
          setThemeVar("--background", "0 0% 3%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "0 0% 6%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "326 100% 70%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "196 100% 60%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 8%")
          setThemeVar("--muted-foreground", "0 0% 60%")
          setThemeVar("--accent", "196 100% 60%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "0 0% 8%")
          setThemeVar("--input", "0 0% 8%")
        } else {
          setThemeVar("--background", "0 0% 0%")
          setThemeVar("--foreground", "0 0% 100%")
          setThemeVar("--card", "0 0% 10%")
          setThemeVar("--card-foreground", "0 0% 100%")
          setThemeVar("--primary", "326 100% 60%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "196 100% 50%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "0 0% 15%")
          setThemeVar("--muted-foreground", "0 0% 70%")
          setThemeVar("--accent", "196 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "0 0% 15%")
          setThemeVar("--input", "0 0% 15%")
        }
        break
      case "beach":
        if (isDark) {
          setThemeVar("--background", "200 50% 15%")
          setThemeVar("--foreground", "40 100% 85%")
          setThemeVar("--card", "200 50% 20%")
          setThemeVar("--card-foreground", "40 100% 85%")
          setThemeVar("--primary", "200 80% 55%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "40 80% 40%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "200 50% 25%")
          setThemeVar("--muted-foreground", "40 100% 70%")
          setThemeVar("--accent", "25 80% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "200 50% 30%")
          setThemeVar("--input", "200 50% 30%")
        } else {
          setThemeVar("--background", "200 100% 90%")
          setThemeVar("--foreground", "25 100% 25%")
          setThemeVar("--card", "200 100% 95%")
          setThemeVar("--card-foreground", "25 100% 25%")
          setThemeVar("--primary", "200 100% 45%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "40 100% 80%")
          setThemeVar("--secondary-foreground", "25 100% 25%")
          setThemeVar("--muted", "200 100% 85%")
          setThemeVar("--muted-foreground", "25 100% 40%")
          setThemeVar("--accent", "25 100% 60%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "200 100% 80%")
          setThemeVar("--input", "200 100% 80%")
        }
        break
      case "mountain":
        if (isDark) {
          setThemeVar("--background", "210 50% 8%")
          setThemeVar("--foreground", "210 50% 90%")
          setThemeVar("--card", "210 50% 12%")
          setThemeVar("--card-foreground", "210 50% 90%")
          setThemeVar("--primary", "210 60% 55%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "210 40% 25%")
          setThemeVar("--secondary-foreground", "210 50% 90%")
          setThemeVar("--muted", "210 50% 15%")
          setThemeVar("--muted-foreground", "210 50% 70%")
          setThemeVar("--accent", "210 60% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "210 50% 20%")
          setThemeVar("--input", "210 50% 20%")
        } else {
          setThemeVar("--background", "210 50% 95%")
          setThemeVar("--foreground", "210 50% 10%")
          setThemeVar("--card", "210 50% 98%")
          setThemeVar("--card-foreground", "210 50% 10%")
          setThemeVar("--primary", "210 50% 40%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "210 30% 70%")
          setThemeVar("--secondary-foreground", "210 50% 10%")
          setThemeVar("--muted", "210 50% 90%")
          setThemeVar("--muted-foreground", "210 50% 40%")
          setThemeVar("--accent", "210 50% 60%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "210 50% 85%")
          setThemeVar("--input", "210 50% 85%")
        }
        break
      case "rainforest":
        if (isDark) {
          setThemeVar("--background", "120 40% 8%")
          setThemeVar("--foreground", "120 30% 90%")
          setThemeVar("--card", "120 40% 12%")
          setThemeVar("--card-foreground", "120 30% 90%")
          setThemeVar("--primary", "120 60% 45%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "80 50% 35%")
          setThemeVar("--secondary-foreground", "0 0% 100%")
          setThemeVar("--muted", "120 40% 15%")
          setThemeVar("--muted-foreground", "120 30% 70%")
          setThemeVar("--accent", "40 80% 55%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "120 40% 20%")
          setThemeVar("--input", "120 40% 20%")
        } else {
          setThemeVar("--background", "120 30% 95%")
          setThemeVar("--foreground", "120 50% 10%")
          setThemeVar("--card", "120 30% 98%")
          setThemeVar("--card-foreground", "120 50% 10%")
          setThemeVar("--primary", "120 50% 30%")
          setThemeVar("--primary-foreground", "0 0% 100%")
          setThemeVar("--secondary", "80 70% 60%")
          setThemeVar("--secondary-foreground", "120 50% 10%")
          setThemeVar("--muted", "120 30% 90%")
          setThemeVar("--muted-foreground", "120 50% 40%")
          setThemeVar("--accent", "40 100% 50%")
          setThemeVar("--accent-foreground", "0 0% 100%")
          setThemeVar("--border", "120 30% 85%")
          setThemeVar("--input", "120 30% 85%")
        }
        break
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
