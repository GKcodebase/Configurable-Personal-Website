"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { useThemeContext } from "@/context/theme-context"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import EditableImage from "@/components/editable/editable-image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HeroProps {
  data: {
    title: string
    size: string
    image: string
    subtitle?: string
    description?: string
    socialLinks?: {
      github: string
      linkedin: string
      twitter: string
    }
  }
}

export default function Hero({ data }: HeroProps) {
  const { primaryColor } = useThemeContext()
  const { updateSection, isEditMode } = useEditContext()
  const [isEditingLinks, setIsEditingLinks] = useState(false)
  const [linkForm, setLinkForm] = useState({
    github: data.socialLinks?.github || "https://github.com",
    linkedin: data.socialLinks?.linkedin || "https://linkedin.com",
    twitter: data.socialLinks?.twitter || "https://twitter.com",
  })

  const handleTitleChange = (newTitle: string) => {
    updateSection("title", {
      ...data,
      title: newTitle,
    })
  }

  const handleSubtitleChange = (newSubtitle: string) => {
    updateSection("title", {
      ...data,
      subtitle: newSubtitle,
    })
  }

  const handleDescriptionChange = (newDescription: string) => {
    updateSection("title", {
      ...data,
      description: newDescription,
    })
  }

  const handleImageChange = (newImage: string) => {
    updateSection("title", {
      ...data,
      image: newImage,
    })
  }

  const handleSaveLinks = () => {
    updateSection("title", {
      ...data,
      socialLinks: linkForm,
    })
    setIsEditingLinks(false)
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 -z-10" />
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <EditableText
                value={data.title}
                onChange={handleTitleChange}
                className={`font-bold tracking-tighter sm:text-5xl xl:text-6xl/none ${data.size}`}
                as="h1"
              />
              <EditableText
                value={data.subtitle || "Full Stack Developer & UI/UX Designer"}
                onChange={handleSubtitleChange}
                className="text-xl text-muted-foreground"
                as="p"
              />
            </div>
            <EditableText
              value={
                data.description ||
                "I build exceptional digital experiences that are fast, accessible, and visually appealing. Currently focused on building responsive web applications."
              }
              onChange={handleDescriptionChange}
              className="max-w-[600px] text-muted-foreground md:text-xl"
              as="p"
              multiline
            />
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild>
                <Link href="#contact">
                  Get in touch <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#projects">View my work</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={data.socialLinks?.github || "https://github.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={data.socialLinks?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href={data.socialLinks?.twitter || "https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>

              {isEditMode && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingLinks(true)}>
                  Edit Links
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative aspect-square overflow-hidden rounded-full border-8 border-background bg-muted w-[280px] h-[280px] md:w-[400px] md:h-[400px]">
              <EditableImage
                src={data.image}
                alt="Profile"
                onChange={handleImageChange}
                className="w-full h-full"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Edit Dialog */}
      <Dialog open={isEditingLinks} onOpenChange={setIsEditingLinks}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Social Links</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="github" className="text-right">
                GitHub
              </Label>
              <Input
                id="github"
                value={linkForm.github}
                onChange={(e) => setLinkForm({ ...linkForm, github: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkedin" className="text-right">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={linkForm.linkedin}
                onChange={(e) => setLinkForm({ ...linkForm, linkedin: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="twitter" className="text-right">
                Twitter
              </Label>
              <Input
                id="twitter"
                value={linkForm.twitter}
                onChange={(e) => setLinkForm({ ...linkForm, twitter: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLinks}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
