"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import { Plus, Minus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AboutProps {
  data: {
    title: string
    size: string
    content: Array<{
      paragraph: number
      text: string
    }>
    journey?: string
    education?: Array<{
      degree: string
      institution: string
      period: string
    }>
  }
  className?: string
}

export default function About({ data, className = "" }: AboutProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [isEditingJourney, setIsEditingJourney] = useState(false)
  const [journeyText, setJourneyText] = useState(
    data.journey ||
      "I started my journey as a self-taught developer, learning HTML, CSS, and JavaScript. Over the years, I've expanded my skills to include modern frameworks like React, Next.js, and various backend technologies. I'm passionate about creating accessible, performant, and beautiful web applications.",
  )
  const [isEditingEducation, setIsEditingEducation] = useState(false)
  const [editingEducationIndex, setEditingEducationIndex] = useState<number | null>(null)
  const [educationForm, setEducationForm] = useState({
    degree: "",
    institution: "",
    period: "",
  })

  const handleTitleChange = (newTitle: string) => {
    updateSection("introduction", {
      ...data,
      title: newTitle,
    })
  }

  const handleParagraphChange = (index: number, newText: string) => {
    const updatedContent = [...data.content]
    updatedContent[index] = {
      ...updatedContent[index],
      text: newText,
    }

    updateSection("introduction", {
      ...data,
      content: updatedContent,
    })
  }

  const addParagraph = () => {
    const newParagraph = {
      paragraph: data.content.length + 1,
      text: "<p>New paragraph. Click to edit.</p>",
    }

    updateSection("introduction", {
      ...data,
      content: [...data.content, newParagraph],
    })
  }

  const removeParagraph = (index: number) => {
    const updatedContent = data.content.filter((_, i) => i !== index)

    // Renumber paragraphs
    const renumberedContent = updatedContent.map((item, i) => ({
      ...item,
      paragraph: i + 1,
    }))

    updateSection("introduction", {
      ...data,
      content: renumberedContent,
    })
  }

  const handleSaveJourney = () => {
    updateSection("introduction", {
      ...data,
      journey: journeyText,
    })
    setIsEditingJourney(false)
  }

  const handleAddEducation = () => {
    setEducationForm({
      degree: "",
      institution: "",
      period: "",
    })
    setEditingEducationIndex(null)
    setIsEditingEducation(true)
  }

  const handleEditEducation = (index: number) => {
    const education = data.education?.[index]
    if (education) {
      setEducationForm({
        degree: education.degree,
        institution: education.institution,
        period: education.period,
      })
      setEditingEducationIndex(index)
      setIsEditingEducation(true)
    }
  }

  const handleRemoveEducation = (index: number) => {
    if (!data.education) return

    const updatedEducation = data.education.filter((_, i) => i !== index)
    updateSection("introduction", {
      ...data,
      education: updatedEducation,
    })
  }

  const handleSaveEducation = () => {
    const newEducation = {
      degree: educationForm.degree,
      institution: educationForm.institution,
      period: educationForm.period,
    }

    if (editingEducationIndex !== null && data.education) {
      // Edit existing education
      const updatedEducation = [...data.education]
      updatedEducation[editingEducationIndex] = newEducation
      updateSection("introduction", {
        ...data,
        education: updatedEducation,
      })
    } else {
      // Add new education
      const updatedEducation = data.education ? [...data.education, newEducation] : [newEducation]
      updateSection("introduction", {
        ...data,
        education: updatedEducation,
      })
    }

    setIsEditingEducation(false)
  }

  // Initialize education if it doesn't exist
  const education = data.education || [
    {
      degree: "B.S. in Computer Science",
      institution: "University of Technology",
      period: "2018-2022",
    },
    {
      degree: "Full Stack Web Development Bootcamp",
      institution: "Tech Bootcamp",
      period: "2022",
    },
    {
      degree: "UI/UX Design Certification",
      institution: "Design Institute",
      period: "2023",
    },
  ]

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            About Me
          </Badge>
          <EditableText
            value={data.title}
            onChange={handleTitleChange}
            className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size}`}
            as="h2"
          />
          <div className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            {data.content.map((paragraph, index) => (
              <div key={index} className="relative mb-4 group">
                <EditableText
                  value={paragraph.text}
                  onChange={(newText) => handleParagraphChange(index, newText)}
                  html={true}
                  multiline={true}
                />

                {isEditMode && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeParagraph(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {isEditMode && (
              <Button variant="outline" size="sm" onClick={addParagraph} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Paragraph
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 mt-12">
        <Card className="group relative">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">My Journey</h3>
                {isEditMode && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingJourney(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground">{data.journey || journeyText}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Education & Training</h3>
                {isEditMode && (
                  <Button variant="ghost" size="sm" onClick={handleAddEducation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                )}
              </div>
              <ul className="space-y-2 text-muted-foreground">
                {education.map((edu, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="mr-2 rounded-full bg-primary h-2 w-2 mt-2.5" />
                    <span className="flex-1">
                      {edu.degree}, {edu.institution} ({edu.period})
                    </span>
                    {isEditMode && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEditEducation(index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleRemoveEducation(index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Edit Dialog */}
      <Dialog open={isEditingJourney} onOpenChange={setIsEditingJourney}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit My Journey</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={journeyText}
              onChange={(e) => setJourneyText(e.target.value)}
              rows={8}
              placeholder="Describe your professional journey..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingJourney(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveJourney}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Education Edit Dialog */}
      <Dialog open={isEditingEducation} onOpenChange={setIsEditingEducation}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingEducationIndex !== null ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="degree">Degree/Certification</Label>
              <Input
                id="degree"
                value={educationForm.degree}
                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                placeholder="B.S. in Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={educationForm.institution}
                onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                placeholder="University of Technology"
              />
            </div>
            <div>
              <Label htmlFor="period">Time Period</Label>
              <Input
                id="period"
                value={educationForm.period}
                onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                placeholder="2018-2022"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingEducation(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEducation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
