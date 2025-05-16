"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useEditContext } from "@/context/edit-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SectionManager() {
  const { isDevMode, isEditMode, portfolioData, updatePortfolioData } = useEditContext()
  const [isOpen, setIsOpen] = useState(false)
  const [newSectionForm, setNewSectionForm] = useState({
    id: "",
    title: "",
    description: "",
    type: "custom",
  })

  if (!isDevMode || !isEditMode || !portfolioData) return null

  const handleAddSection = () => {
    const id = newSectionForm.id.trim().toLowerCase().replace(/\s+/g, "_")
    if (!id) return

    const updatedData = { ...portfolioData }

    // Create the new section based on type
    if (newSectionForm.type === "custom") {
      updatedData[id] = {
        isRequired: false,
        title: newSectionForm.title,
        size: "text-2xl",
        content: [
          {
            paragraph: 1,
            text: `<p>${newSectionForm.description || "Add your content here."}</p>`,
          },
        ],
      }
    } else if (newSectionForm.type === "gallery") {
      updatedData[id] = {
        isRequired: false,
        title: newSectionForm.title,
        size: "text-2xl",
        items: [
          {
            title: "Sample Item",
            description: newSectionForm.description || "Add your description here.",
            image: "/placeholder.svg?height=300&width=500",
          },
        ],
      }
    } else if (newSectionForm.type === "timeline") {
      updatedData[id] = {
        isRequired: false,
        title: newSectionForm.title,
        size: "text-2xl",
        items: [
          {
            title: "Sample Event",
            date: "2023",
            description: newSectionForm.description || "Add your description here.",
          },
        ],
      }
    }

    updatePortfolioData(updatedData)
    setIsOpen(false)
    setNewSectionForm({
      id: "",
      title: "",
      description: "",
      type: "custom",
    })
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span>Manage Sections</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
            <DialogDescription>
              Create a new section for your portfolio. This will be added to your page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="sectionId">Section ID</Label>
              <Input
                id="sectionId"
                value={newSectionForm.id}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, id: e.target.value })}
                placeholder="my_new_section"
              />
              <p className="text-xs text-muted-foreground mt-1">
                A unique identifier for this section (no spaces, use underscores)
              </p>
            </div>
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={newSectionForm.title}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, title: e.target.value })}
                placeholder="My New Section"
              />
            </div>
            <div>
              <Label htmlFor="sectionType">Section Type</Label>
              <Select
                value={newSectionForm.type}
                onValueChange={(value) => setNewSectionForm({ ...newSectionForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a section type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Content</SelectItem>
                  <SelectItem value="gallery">Gallery/Grid</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">The type of section determines its initial structure</p>
            </div>
            <div>
              <Label htmlFor="sectionDescription">Initial Content</Label>
              <Textarea
                id="sectionDescription"
                value={newSectionForm.description}
                onChange={(e) => setNewSectionForm({ ...newSectionForm, description: e.target.value })}
                placeholder="Add initial content or description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection}>Add Section</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
