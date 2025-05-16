"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Code, Lightbulb, Plus, Minus, Edit } from "lucide-react"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import EditableList from "@/components/editable/editable-list"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ExperienceProps {
  data: {
    title: string
    size: string
    items: Array<{
      company: string
      role: string
      timePeriod: {
        start: number
        end: number | null
      }
      location: string
      points: string[]
    }>
    skills?: Array<{
      title: string
      icon: "code" | "briefcase" | "lightbulb"
      items: string[]
    }>
  }
  className?: string
}

export default function Experience({ data, className = "" }: ExperienceProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [editingJobIndex, setEditingJobIndex] = useState<number | null>(null)
  const [jobForm, setJobForm] = useState({
    company: "",
    role: "",
    startYear: new Date().getFullYear(),
    endYear: null as number | null,
    location: "",
    points: [""],
  })
  const [isEditingSkill, setIsEditingSkill] = useState(false)
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null)
  const [skillForm, setSkillForm] = useState({
    title: "",
    icon: "code" as "code" | "briefcase" | "lightbulb",
    items: [""],
  })

  // Initialize skills if they don't exist
  const skills = data.skills || [
    {
      title: "Frontend Development",
      icon: "code" as const,
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
    },
    {
      title: "Backend Development",
      icon: "briefcase" as const,
      items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase", "RESTful APIs", "GraphQL"],
    },
    {
      title: "UI/UX Design",
      icon: "lightbulb" as const,
      items: ["Figma", "Adobe XD", "Responsive Design", "Wireframing", "Prototyping"],
    },
  ]

  const handleTitleChange = (newTitle: string) => {
    updateSection("workExperience", {
      ...data,
      title: newTitle,
    })
  }

  const handlePointsChange = (index: number, newPoints: string[]) => {
    const updatedItems = [...data.items]
    updatedItems[index] = {
      ...updatedItems[index],
      points: newPoints,
    }

    updateSection("workExperience", {
      ...data,
      items: updatedItems,
    })
  }

  const handleRemoveJob = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index)

    updateSection("workExperience", {
      ...data,
      items: updatedItems,
    })
  }

  const handleEditJob = (index: number) => {
    const job = data.items[index]
    setJobForm({
      company: job.company,
      role: job.role,
      startYear: job.timePeriod.start,
      endYear: job.timePeriod.end,
      location: job.location,
      points: [...job.points],
    })
    setEditingJobIndex(index)
  }

  const handleAddNewJob = () => {
    setJobForm({
      company: "",
      role: "",
      startYear: new Date().getFullYear(),
      endYear: null,
      location: "",
      points: [""],
    })
    setIsAddingJob(true)
  }

  const handleSaveJob = () => {
    if (editingJobIndex !== null) {
      // Edit existing job
      const updatedItems = [...data.items]
      updatedItems[editingJobIndex] = {
        company: jobForm.company,
        role: jobForm.role,
        timePeriod: {
          start: jobForm.startYear,
          end: jobForm.endYear,
        },
        location: jobForm.location,
        points: jobForm.points.filter((p) => p.trim() !== ""),
      }

      updateSection("workExperience", {
        ...data,
        items: updatedItems,
      })

      setEditingJobIndex(null)
    } else {
      // Add new job
      const newJob = {
        company: jobForm.company,
        role: jobForm.role,
        timePeriod: {
          start: jobForm.startYear,
          end: jobForm.endYear,
        },
        location: jobForm.location,
        points: jobForm.points.filter((p) => p.trim() !== ""),
      }

      updateSection("workExperience", {
        ...data,
        items: [...data.items, newJob],
      })

      setIsAddingJob(false)
    }
  }

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...jobForm.points]
    newPoints[index] = value
    setJobForm({
      ...jobForm,
      points: newPoints,
    })
  }

  const addPoint = () => {
    setJobForm({
      ...jobForm,
      points: [...jobForm.points, ""],
    })
  }

  const removePoint = (index: number) => {
    const newPoints = jobForm.points.filter((_, i) => i !== index)
    setJobForm({
      ...jobForm,
      points: newPoints,
    })
  }

  const handleEditSkill = (index: number) => {
    if (!data.skills) return

    const skill = data.skills[index]
    setSkillForm({
      title: skill.title,
      icon: skill.icon,
      items: [...skill.items],
    })
    setEditingSkillIndex(index)
    setIsEditingSkill(true)
  }

  const handleAddSkill = () => {
    setSkillForm({
      title: "",
      icon: "code",
      items: [""],
    })
    setEditingSkillIndex(null)
    setIsEditingSkill(true)
  }

  const handleRemoveSkill = (index: number) => {
    if (!data.skills) return

    const updatedSkills = data.skills.filter((_, i) => i !== index)
    updateSection("workExperience", {
      ...data,
      skills: updatedSkills,
    })
  }

  const handleSaveSkill = () => {
    const newSkill = {
      title: skillForm.title,
      icon: skillForm.icon,
      items: skillForm.items.filter((item) => item.trim() !== ""),
    }

    if (editingSkillIndex !== null && data.skills) {
      // Edit existing skill
      const updatedSkills = [...data.skills]
      updatedSkills[editingSkillIndex] = newSkill
      updateSection("workExperience", {
        ...data,
        skills: updatedSkills,
      })
    } else {
      // Add new skill
      const updatedSkills = data.skills ? [...data.skills, newSkill] : [newSkill]
      updateSection("workExperience", {
        ...data,
        skills: updatedSkills,
      })
    }

    setIsEditingSkill(false)
  }

  const handleSkillItemChange = (index: number, value: string) => {
    const newItems = [...skillForm.items]
    newItems[index] = value
    setSkillForm({
      ...skillForm,
      items: newItems,
    })
  }

  const addSkillItem = () => {
    setSkillForm({
      ...skillForm,
      items: [...skillForm.items, ""],
    })
  }

  const removeSkillItem = (index: number) => {
    const newItems = skillForm.items.filter((_, i) => i !== index)
    setSkillForm({
      ...skillForm,
      items: newItems,
    })
  }

  const getIconComponent = (iconName: "code" | "briefcase" | "lightbulb") => {
    switch (iconName) {
      case "code":
        return <Code className="h-6 w-6 text-primary" />
      case "briefcase":
        return <Briefcase className="h-6 w-6 text-primary" />
      case "lightbulb":
        return <Lightbulb className="h-6 w-6 text-primary" />
      default:
        return <Code className="h-6 w-6 text-primary" />
    }
  }

  return (
    <section id="experience" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="px-3 py-1 text-sm" variant="secondary">
              Experience
            </Badge>
            <EditableText
              value={data.title}
              onChange={handleTitleChange}
              className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size}`}
              as="h2"
            />
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              I've worked with a variety of technologies and frameworks to create exceptional digital experiences.
            </p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          {isEditMode && (
            <Button variant="outline" size="sm" onClick={handleAddSkill}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill Card
            </Button>
          )}
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-4">
          {skills.map((skill, index) => (
            <Card key={index} className="group relative">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">{getIconComponent(skill.icon)}</div>
                <EditableText
                  value={skill.title}
                  onChange={(newTitle) => {
                    if (!data.skills) return
                    const updatedSkills = [...data.skills]
                    updatedSkills[index] = {
                      ...updatedSkills[index],
                      title: newTitle,
                    }
                    updateSection("workExperience", {
                      ...data,
                      skills: updatedSkills,
                    })
                  }}
                  className="text-xl font-bold"
                  as="h3"
                />
                <p className="mt-2 text-muted-foreground">{skill.items.join(", ")}</p>

                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => handleEditSkill(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveSkill(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-center">Work History</h3>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={handleAddNewJob}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            )}
          </div>
          <div className="space-y-8">
            {data.items.map((job, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-muted group">
                <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-primary" />
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <EditableText
                      value={job.role}
                      onChange={(newRole) => {
                        const updatedItems = [...data.items]
                        updatedItems[index] = {
                          ...updatedItems[index],
                          role: newRole,
                        }
                        updateSection("workExperience", {
                          ...data,
                          items: updatedItems,
                        })
                      }}
                      className="text-xl font-bold"
                      as="h4"
                    />

                    {isEditMode && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" onClick={() => handleEditJob(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleRemoveJob(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    <EditableText
                      value={job.company}
                      onChange={(newCompany) => {
                        const updatedItems = [...data.items]
                        updatedItems[index] = {
                          ...updatedItems[index],
                          company: newCompany,
                        }
                        updateSection("workExperience", {
                          ...data,
                          items: updatedItems,
                        })
                      }}
                      as="span"
                      className="font-medium"
                    />{" "}
                    •
                    <EditableText
                      value={job.location}
                      onChange={(newLocation) => {
                        const updatedItems = [...data.items]
                        updatedItems[index] = {
                          ...updatedItems[index],
                          location: newLocation,
                        }
                        updateSection("workExperience", {
                          ...data,
                          items: updatedItems,
                        })
                      }}
                      as="span"
                      className="ml-1"
                    />{" "}
                    • {job.timePeriod.start} - {job.timePeriod.end || "Present"}
                  </p>
                  <EditableList
                    items={job.points}
                    onChange={(newPoints) => handlePointsChange(index, newPoints)}
                    className="text-muted-foreground mt-2"
                    addLabel="Add responsibility"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Form Dialog */}
        <Dialog
          open={isAddingJob || editingJobIndex !== null}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddingJob(false)
              setEditingJobIndex(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingJobIndex !== null ? "Edit Job" : "Add New Job"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="role">Job Title</Label>
                  <Input
                    id="role"
                    value={jobForm.role}
                    onChange={(e) => setJobForm({ ...jobForm, role: e.target.value })}
                    placeholder="Senior Frontend Developer"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startYear">Start Year</Label>
                    <Input
                      id="startYear"
                      type="number"
                      value={jobForm.startYear}
                      onChange={(e) => setJobForm({ ...jobForm, startYear: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endYear">End Year</Label>
                    <Input
                      id="endYear"
                      type="number"
                      value={jobForm.endYear || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                        setJobForm({ ...jobForm, endYear: value })
                      }}
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Responsibilities</Label>
                  <div className="space-y-2 mt-2">
                    {jobForm.points.map((point, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={point}
                          onChange={(e) => handlePointChange(i, e.target.value)}
                          placeholder="Describe a responsibility"
                        />
                        <Button size="icon" variant="ghost" onClick={() => removePoint(i)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addPoint}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Point
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingJob(false)
                  setEditingJobIndex(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveJob}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Skill Edit Dialog */}
        <Dialog
          open={isEditingSkill}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditingSkill(false)
              setEditingSkillIndex(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingSkillIndex !== null ? "Edit Skill" : "Add New Skill"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="skillTitle">Skill Title</Label>
                <Input
                  id="skillTitle"
                  value={skillForm.title}
                  onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                  placeholder="Frontend Development"
                />
              </div>
              <div>
                <Label htmlFor="skillIcon">Icon</Label>
                <select
                  id="skillIcon"
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value as any })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="code">Code</option>
                  <option value="briefcase">Briefcase</option>
                  <option value="lightbulb">Lightbulb</option>
                </select>
              </div>
              <div>
                <Label>Skill Items</Label>
                <div className="space-y-2 mt-2">
                  {skillForm.items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleSkillItemChange(i, e.target.value)}
                        placeholder="Skill item"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeSkillItem(i)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSkillItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingSkill(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSkill}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
