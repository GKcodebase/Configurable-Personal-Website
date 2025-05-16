"use client"

import { useThemeContext } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const {
    theme,
    fontFamily,
    fontSize,
    margin,
    padding,
    primaryColor,
    secondaryColor,
    isDarkMode,
    toggleDarkMode,
    setTheme,
    setFontFamily,
    setFontSize,
    setMargin,
    setPadding,
    setPrimaryColor,
    setSecondaryColor,
  } = useThemeContext()

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="theme">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose a predefined theme for your portfolio website.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Dark Mode</h3>
                <Button variant={isDarkMode ? "default" : "outline"} onClick={toggleDarkMode}>
                  {isDarkMode ? "Dark Mode On" : "Dark Mode Off"}
                </Button>
              </div>

              <h3 className="text-lg font-medium mb-4">Theme Selection</h3>
              <RadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ThemeOption
                    value="netflix"
                    name="Netflix"
                    description="Dark background with red accents"
                    bgColor="bg-gray-900"
                    accentColor="bg-red-600"
                    textColor="text-white"
                    selected={theme === "netflix"}
                  />
                  <ThemeOption
                    value="youtube"
                    name="YouTube"
                    description="Light background with red accents"
                    bgColor="bg-white"
                    accentColor="bg-red-500"
                    textColor="text-gray-900"
                    selected={theme === "youtube"}
                  />
                  <ThemeOption
                    value="spotify"
                    name="Spotify"
                    description="Dark green background with lime accents"
                    bgColor="bg-green-900"
                    accentColor="bg-lime-400"
                    textColor="text-white"
                    selected={theme === "spotify"}
                  />
                  <ThemeOption
                    value="snapchat"
                    name="Snapchat"
                    description="Yellow background with black accents"
                    bgColor="bg-yellow-400"
                    accentColor="bg-black"
                    textColor="text-black"
                    selected={theme === "snapchat"}
                  />
                  <ThemeOption
                    value="steam"
                    name="Steam"
                    description="Dark blue background with neon blue accents"
                    bgColor="bg-blue-900"
                    accentColor="bg-blue-400"
                    textColor="text-white"
                    selected={theme === "steam"}
                  />
                  <ThemeOption
                    value="uber"
                    name="Uber"
                    description="Black background with white accents"
                    bgColor="bg-black"
                    accentColor="bg-white"
                    textColor="text-white"
                    selected={theme === "uber"}
                  />
                  <ThemeOption
                    value="tiktok"
                    name="TikTok"
                    description="Black background with neon pink/blue accents"
                    bgColor="bg-black"
                    accentColor="bg-pink-500"
                    textColor="text-white"
                    selected={theme === "tiktok"}
                  />
                  <ThemeOption
                    value="beach"
                    name="Beach"
                    description="Light blue with sand accents"
                    bgColor="bg-sky-100"
                    accentColor="bg-amber-200"
                    textColor="text-amber-900"
                    selected={theme === "beach"}
                  />
                  <ThemeOption
                    value="mountain"
                    name="Mountain"
                    description="Cool blues and grays with snow white accents"
                    bgColor="bg-blue-50"
                    accentColor="bg-blue-400"
                    textColor="text-blue-900"
                    selected={theme === "mountain"}
                  />
                  <ThemeOption
                    value="rainforest"
                    name="Rainforest"
                    description="Deep greens with bright accent colors"
                    bgColor="bg-green-50"
                    accentColor="bg-green-600"
                    textColor="text-green-900"
                    selected={theme === "rainforest"}
                  />
                  <ThemeOption
                    value="custom"
                    name="Custom"
                    description="Your custom theme"
                    bgColor="bg-white dark:bg-slate-950"
                    accentColor="bg-primary"
                    textColor="text-foreground"
                    selected={theme === "custom"}
                  />
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Customize the font family and size for your portfolio website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Font Family</h3>
                <RadioGroup value={fontFamily} onValueChange={(value) => setFontFamily(value as any)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FontOption value="inter" name="Inter" selected={fontFamily === "inter"} />
                    <FontOption value="roboto" name="Roboto" selected={fontFamily === "roboto"} />
                    <FontOption value="poppins" name="Poppins" selected={fontFamily === "poppins"} />
                    <FontOption value="openSans" name="Open Sans" selected={fontFamily === "openSans"} />
                    <FontOption value="lato" name="Lato" selected={fontFamily === "lato"} />
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Font Size</h3>
                <RadioGroup value={fontSize} onValueChange={(value) => setFontSize(value as any)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SizeOption value="sm" name="Small" selected={fontSize === "sm"} />
                    <SizeOption value="base" name="Medium" selected={fontSize === "base"} />
                    <SizeOption value="lg" name="Large" selected={fontSize === "lg"} />
                    <SizeOption value="xl" name="Extra Large" selected={fontSize === "xl"} />
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spacing</CardTitle>
              <CardDescription>Adjust the margin and padding for your portfolio website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Margin</h3>
                <RadioGroup value={margin} onValueChange={(value) => setMargin(value as any)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SpacingOption value="2" name="Small" size="8px" selected={margin === "2"} />
                    <SpacingOption value="4" name="Medium" size="16px" selected={margin === "4"} />
                    <SpacingOption value="6" name="Large" size="24px" selected={margin === "6"} />
                    <SpacingOption value="8" name="Extra Large" size="32px" selected={margin === "8"} />
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Padding</h3>
                <RadioGroup value={padding} onValueChange={(value) => setPadding(value as any)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SpacingOption value="2" name="Small" size="8px" selected={padding === "2"} />
                    <SpacingOption value="4" name="Medium" size="16px" selected={padding === "4"} />
                    <SpacingOption value="6" name="Large" size="24px" selected={padding === "6"} />
                    <SpacingOption value="8" name="Extra Large" size="32px" selected={padding === "8"} />
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Customize the primary and secondary colors for your portfolio website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="primaryColor" className="text-lg font-medium mb-3 block">
                  Primary Color
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32"
                  />
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor" className="text-lg font-medium mb-3 block">
                  Secondary Color
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-32"
                  />
                  <div className="w-10 h-10 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SettingsPreview />
    </div>
  )
}

interface ThemeOptionProps {
  value: string
  name: string
  description: string
  bgColor: string
  accentColor: string
  textColor: string
  selected: boolean
}

function ThemeOption({ value, name, description, bgColor, accentColor, textColor, selected }: ThemeOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`theme-${value}`} className="sr-only" />
      <Label
        htmlFor={`theme-${value}`}
        className={`flex flex-col h-full rounded-md border-2 p-4 cursor-pointer transition-all ${
          selected ? "border-primary" : "border-muted hover:border-muted-foreground"
        }`}
      >
        <div className={`rounded-md ${bgColor} p-4 mb-3`}>
          <div className={`${accentColor} h-6 w-20 rounded-md mb-2`}></div>
          <div className={`${textColor} h-3 w-32 rounded-md mb-1 bg-current opacity-70`}></div>
          <div className={`${textColor} h-3 w-24 rounded-md bg-current opacity-70`}></div>
        </div>
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </Label>
    </div>
  )
}

interface FontOptionProps {
  value: string
  name: string
  selected: boolean
}

function FontOption({ value, name, selected }: FontOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`font-${value}`} className="sr-only" />
      <Label
        htmlFor={`font-${value}`}
        className={`flex items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all ${
          selected ? "border-primary" : "border-muted hover:border-muted-foreground"
        }`}
      >
        <span className={`font-${value}`}>{name}</span>
        {selected && <div className="h-2 w-2 rounded-full bg-primary"></div>}
      </Label>
    </div>
  )
}

interface SizeOptionProps {
  value: string
  name: string
  selected: boolean
}

function SizeOption({ value, name, selected }: SizeOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`size-${value}`} className="sr-only" />
      <Label
        htmlFor={`size-${value}`}
        className={`flex items-center justify-between rounded-md border-2 p-4 cursor-pointer transition-all ${
          selected ? "border-primary" : "border-muted hover:border-muted-foreground"
        }`}
      >
        <span className={`text-${value}`}>{name}</span>
        {selected && <div className="h-2 w-2 rounded-full bg-primary"></div>}
      </Label>
    </div>
  )
}

interface SpacingOptionProps {
  value: string
  name: string
  size: string
  selected: boolean
}

function SpacingOption({ value, name, size, selected }: SpacingOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={`spacing-${value}`} className="sr-only" />
      <Label
        htmlFor={`spacing-${value}`}
        className={`flex flex-col rounded-md border-2 p-4 cursor-pointer transition-all ${
          selected ? "border-primary" : "border-muted hover:border-muted-foreground"
        }`}
      >
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{size}</span>
        <div className={`mt-2 p-${value} bg-muted rounded-md`}>
          <div className="h-4 bg-primary/20 rounded-md"></div>
        </div>
      </Label>
    </div>
  )
}

function SettingsPreview() {
  const { theme, fontFamily, fontSize, margin, padding, primaryColor, secondaryColor, isDarkMode } = useThemeContext()

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Current Settings Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Theme:</span> {theme}
              </li>
              <li>
                <span className="font-medium">Dark Mode:</span> {isDarkMode ? "On" : "Off"}
              </li>
              <li>
                <span className="font-medium">Font Family:</span> {fontFamily}
              </li>
              <li>
                <span className="font-medium">Font Size:</span> {fontSize}
              </li>
              <li>
                <span className="font-medium">Margin:</span> {margin}
              </li>
              <li>
                <span className="font-medium">Padding:</span> {padding}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Primary Color</p>
                <div className="h-10 rounded-md bg-primary"></div>
              </div>
              <div>
                <p className="mb-2">Secondary Color</p>
                <div className="h-10 rounded-md bg-secondary"></div>
              </div>
              <div>
                <p className="mb-2">Background</p>
                <div className="h-10 rounded-md bg-background border border-border"></div>
              </div>
              <div>
                <p className="mb-2">Text</p>
                <div className="h-10 rounded-md bg-foreground"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <div className="p-4 bg-card rounded-md border border-border">
                <p className="text-card-foreground">Card Content Example</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
