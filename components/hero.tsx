"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Twitch,
  Dribbble,
  Figma,
  SquareStackIcon as StackOverflow,
  Plus,
  Minus,
  Edit,
} from "lucide-react"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { useThemeContext } from "@/context/theme-context"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import EditableImage from "@/components/editable/editable-image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const [isEditingSocialLink, setIsEditingSocialLink] = useState(false)
  const [currentSocialLink, setCurrentSocialLink] = useState({ platform: "", url: "" })

  const handleEditSocialLink = (platform: string, url: string) => {
    setCurrentSocialLink({ platform, url })
    setIsEditingSocialLink(true)
  }

  const handleAddSocialLink = () => {
    setCurrentSocialLink({ platform: "", url: "" })
    setIsEditingSocialLink(true)
  }

  const handleRemoveSocialLink = (platform: string) => {
    if (!data.socialLinks) return

    const updatedSocialLinks = { ...data.socialLinks }
    delete updatedSocialLinks[platform]

    updateSection("title", {
      ...data,
      socialLinks: updatedSocialLinks,
    })
  }

  const handleSaveSocialLink = () => {
    if (!currentSocialLink.platform || !currentSocialLink.url) return

    const updatedSocialLinks = { ...data.socialLinks } || {}
    updatedSocialLinks[currentSocialLink.platform] = currentSocialLink.url

    updateSection("title", {
      ...data,
      socialLinks: updatedSocialLinks,
    })

    setIsEditingSocialLink(false)
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="h-6 w-6" />
      case "linkedin":
        return <Linkedin className="h-6 w-6" />
      case "twitter":
        return <Twitter className="h-6 w-6" />
      case "email":
        return <Mail className="h-6 w-6" />
      case "instagram":
        return <Instagram className="h-6 w-6" />
      case "youtube":
        return <Youtube className="h-6 w-6" />
      case "facebook":
        return <Facebook className="h-6 w-6" />
      case "twitch":
        return <Twitch className="h-6 w-6" />
      case "dribbble":
        return <Dribbble className="h-6 w-6" />
      case "figma":
        return <Figma className="h-6 w-6" />
      case "stackoverflow":
        return <StackOverflow className="h-6 w-6" />
      default:
        return <Link className="h-6 w-6" />
    }
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
              {/* Render existing social links */}
              {isEditMode ? (
                <div className="flex flex-wrap items-center gap-4">
                  {data.socialLinks &&
                    Object.entries(data.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <div key={platform} className="relative group">
                            <Link
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {getSocialIcon(platform)}
                              <span className="sr-only">{platform}</span>
                            </Link>
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5"
                                onClick={() => handleEditSocialLink(platform, url)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5"
                                onClick={() => handleRemoveSocialLink(platform)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ),
                    )}
                  <Button variant="ghost" size="icon" onClick={handleAddSocialLink}>
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Add social link</span>
                  </Button>
                </div>
              ) : (
                <>
                  {data.socialLinks?.github && (
                    <Link
                      href={data.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-6 w-6" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                  )}
                  {data.socialLinks?.linkedin && (
                    <Link
                      href={data.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-6 w-6" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  )}
                  {data.socialLinks?.twitter && (
                    <Link
                      href={data.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-6 w-6" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  )}
                  {data.socialLinks?.email && (
                    <Link
                      href={`mailto:${data.socialLinks.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-6 w-6" />
                      <span className="sr-only">Email</span>
                    </Link>
                  )}
                  {data.socialLinks?.instagram && (
                    <Link
                      href={data.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-6 w-6" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  )}
                  {data.socialLinks?.youtube && (
                    <Link
                      href={data.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Youtube className="h-6 w-6" />
                      <span className="sr-only">YouTube</span>
                    </Link>
                  )}
                  {data.socialLinks?.facebook && (
                    <Link
                      href={data.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Facebook className="h-6 w-6" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  )}
                  {data.socialLinks?.stackoverflow && (
                    <Link
                      href={data.socialLinks.stackoverflow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <StackOverflow className="h-6 w-6" />
                      <span className="sr-only">Stack Overflow</span>
                    </Link>
                  )}
                  {/* Add other social links here */}
                </>
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

      {/* Social Link Edit Dialog */}
      <Dialog open={isEditingSocialLink} onOpenChange={setIsEditingSocialLink}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentSocialLink.platform ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select
                value={currentSocialLink.platform}
                onValueChange={(value) => setCurrentSocialLink({ ...currentSocialLink, platform: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">GitHub</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitch">Twitch</SelectItem>
                  <SelectItem value="dribbble">Dribbble</SelectItem>
                  <SelectItem value="figma">Figma</SelectItem>
                  <SelectItem value="stackoverflow">Stack Overflow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                {currentSocialLink.platform === "email" ? "Email" : "URL"}
              </Label>
              <Input
                id="url"
                value={currentSocialLink.url}
                onChange={(e) => setCurrentSocialLink({ ...currentSocialLink, url: e.target.value })}
                placeholder={currentSocialLink.platform === "email" ? "your@email.com" : "https://..."}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingSocialLink(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSocialLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
