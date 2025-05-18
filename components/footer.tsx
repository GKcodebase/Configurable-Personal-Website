"use client"

import { Github, Linkedin, Mail, Twitter, Plus, Minus, Edit } from "lucide-react"
import Link from "next/link"
import { useEditContext } from "@/context/edit-context"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Footer() {
  const { portfolioData, updateSection, isEditMode } = useEditContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentLink, setCurrentLink] = useState<{ type: string; url: string }>({ type: "", url: "" })
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleEditLink = (type: string) => {
    if (!portfolioData?.contacts?.details) return

    let url = ""
    if (type === "email") {
      url = portfolioData.contacts.details.email || ""
    } else {
      url = (portfolioData.contacts.details[type as keyof typeof portfolioData.contacts.details] as string) || ""
    }

    setCurrentLink({ type, url })
    setIsAddingNew(false)
    setIsDialogOpen(true)
  }

  const handleAddLink = () => {
    setCurrentLink({ type: "github", url: "" })
    setIsAddingNew(true)
    setIsDialogOpen(true)
  }

  const handleRemoveLink = (type: string) => {
    if (!portfolioData?.contacts?.details) return

    const updatedDetails = { ...portfolioData.contacts.details }
    if (type in updatedDetails) {
      updatedDetails[type as keyof typeof updatedDetails] = ""

      updateSection("contacts", {
        ...portfolioData.contacts,
        details: updatedDetails,
      })
    }
  }

  const handleSaveLink = () => {
    if (!portfolioData?.contacts?.details || !currentLink.type) return

    const updatedDetails = { ...portfolioData.contacts.details }

    if (currentLink.type === "email") {
      updatedDetails.email = currentLink.url
    } else {
      updatedDetails[currentLink.type as keyof typeof updatedDetails] = currentLink.url
    }

    updateSection("contacts", {
      ...portfolioData.contacts,
      details: updatedDetails,
    })

    setIsDialogOpen(false)
  }

  return (
    <footer className="border-t bg-white dark:bg-slate-950">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{portfolioData?.title?.title || "John Doe"}</h3>
            <p className="text-sm text-muted-foreground">
              {portfolioData?.title?.subtitle || "Full Stack Developer & UI/UX Designer"}
              {portfolioData?.contacts?.details?.location
                ? ` based in ${portfolioData.contacts.details.location}.`
                : ""}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Connect</h3>
            <ul className="space-y-2 text-sm">
              {portfolioData?.contacts?.details && (
                <>
                  {portfolioData.contacts.details.github && (
                    <li className="group relative">
                      <Link
                        href={portfolioData.contacts.details.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                      {isEditMode && (
                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={() => handleEditLink("github")}
                            className="p-1 text-xs bg-primary/10 rounded hover:bg-primary/20"
                            title="Edit link"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveLink("github")}
                            className="p-1 text-xs bg-destructive/10 rounded hover:bg-destructive/20"
                            title="Remove link"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                  {portfolioData.contacts.details.linkedin && (
                    <li className="group relative">
                      <Link
                        href={portfolioData.contacts.details.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Linkedin className="mr-2 h-4 w-4" />
                        LinkedIn
                      </Link>
                      {isEditMode && (
                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={() => handleEditLink("linkedin")}
                            className="p-1 text-xs bg-primary/10 rounded hover:bg-primary/20"
                            title="Edit link"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveLink("linkedin")}
                            className="p-1 text-xs bg-destructive/10 rounded hover:bg-destructive/20"
                            title="Remove link"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                  {portfolioData.contacts.details.twitter && (
                    <li className="group relative">
                      <Link
                        href={portfolioData.contacts.details.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                      </Link>
                      {isEditMode && (
                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={() => handleEditLink("twitter")}
                            className="p-1 text-xs bg-primary/10 rounded hover:bg-primary/20"
                            title="Edit link"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveLink("twitter")}
                            className="p-1 text-xs bg-destructive/10 rounded hover:bg-destructive/20"
                            title="Remove link"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                  {portfolioData.contacts.details.email && (
                    <li className="group relative">
                      <Link
                        href={`mailto:${portfolioData.contacts.details.email}`}
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Link>
                      {isEditMode && (
                        <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                          <button
                            onClick={() => handleEditLink("email")}
                            className="p-1 text-xs bg-primary/10 rounded hover:bg-primary/20"
                            title="Edit link"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveLink("email")}
                            className="p-1 text-xs bg-destructive/10 rounded hover:bg-destructive/20"
                            title="Remove link"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </li>
                  )}
                </>
              )}
              {isEditMode && (
                <li>
                  <button
                    onClick={handleAddLink}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Subscribe</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to my newsletter to get updates on my latest projects and articles.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </div>
      </div>

      {/* Link Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isAddingNew ? "Add Link" : "Edit Link"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {isAddingNew && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkType" className="text-right">
                  Type
                </Label>
                <Select
                  value={currentLink.type}
                  onValueChange={(value) => setCurrentLink({ ...currentLink, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select link type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkUrl" className="text-right">
                {currentLink.type === "email" ? "Email" : "URL"}
              </Label>
              <Input
                id="linkUrl"
                value={currentLink.url}
                onChange={(e) => setCurrentLink({ ...currentLink, url: e.target.value })}
                placeholder={currentLink.type === "email" ? "your@email.com" : "https://..."}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLink}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  )
}
