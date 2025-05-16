"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, Plus, Minus, Edit } from "lucide-react"
import Link from "next/link"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import EditableImage from "@/components/editable/editable-image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProjectsProps {
  data: {
    title: string
    size: string
    items: Array<{
      title: string
      photo: string
      links: {
        github: string
        demo: string
      }
      description: string
      technologies: string[]
    }>
  }
  className?: string
}

export default function Projects({ data, className = "" }: ProjectsProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [projectForm, setProjectForm] = useState({
    title: "",
    photo: "/placeholder.svg?height=300&width=500",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
    },
    description: "",
    technologies: [""],
  })

  const handleTitleChange = (newTitle: string) => {
    updateSection("projects", {
      ...data,
      title: newTitle,
    })
  }

  const handleProjectTitleChange = (index: number, newTitle: string) => {
    const updatedItems = [...data.items]
    updatedItems[index] = {
      ...updatedItems[index],
      title: newTitle,
    }

    updateSection("projects", {
      ...data,
      items: updatedItems,
    })
  }

  const handleProjectDescriptionChange = (index: number, newDescription: string) => {
    const updatedItems = [...data.items]
    updatedItems[index] = {
      ...updatedItems[index],
      description: newDescription,
    }

    updateSection("projects", {
      ...data,
      items: updatedItems,
    })
  }

  const handleProjectImageChange = (index: number, newImage: string) => {
    const updatedItems = [...data.items]
    updatedItems[index] = {
      ...updatedItems[index],
      photo: newImage,
    }

    updateSection("projects", {
      ...data,
      items: updatedItems,
    })
  }

  const handleTechnologiesChange = (index: number, newTechnologies: string[]) => {
    const updatedItems = [...data.items]
    updatedItems[index] = {
      ...updatedItems[index],
      technologies: newTechnologies,
    }

    updateSection("projects", {
      ...data,
      items: updatedItems,
    })
  }

  const handleRemoveProject = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index)

    updateSection("projects", {
      ...data,
      items: updatedItems,
    })
  }

  const handleEditProject = (index: number) => {
    const project = data.items[index]
    setProjectForm({
      title: project.title,
      photo: project.photo,
      links: { ...project.links },
      description: project.description,
      technologies: [...project.technologies],
    })
    setEditingProjectIndex(index)
  }

  const handleAddNewProject = () => {
    setProjectForm({
      title: "New Project",
      photo: "/placeholder.svg?height=300&width=500",
      links: {
        github: "https://github.com",
        demo: "https://example.com",
      },
      description: "Project description goes here.",
      technologies: ["Technology 1"],
    })
    setIsAddingProject(true)
  }

  const handleSaveProject = () => {
    if (editingProjectIndex !== null) {
      // Edit existing project
      const updatedItems = [...data.items]
      updatedItems[editingProjectIndex] = {
        ...projectForm,
        technologies: projectForm.technologies.filter((t) => t.trim() !== ""),
      }

      updateSection("projects", {
        ...data,
        items: updatedItems,
      })

      setEditingProjectIndex(null)
    } else {
      // Add new project
      const newProject = {
        ...projectForm,
        technologies: projectForm.technologies.filter((t) => t.trim() !== ""),
      }

      updateSection("projects", {
        ...data,
        items: [...data.items, newProject],
      })

      setIsAddingProject(false)
    }
  }

  const handleTechChange = (index: number, value: string) => {
    const newTechs = [...projectForm.technologies]
    newTechs[index] = value
    setProjectForm({
      ...projectForm,
      technologies: newTechs,
    })
  }

  const addTech = () => {
    setProjectForm({
      ...projectForm,
      technologies: [...projectForm.technologies, ""],
    })
  }

  const removeTech = (index: number) => {
    const newTechs = projectForm.technologies.filter((_, i) => i !== index)
    setProjectForm({
      ...projectForm,
      technologies: newTechs,
    })
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            Projects
          </Badge>
          <EditableText
            value={data.title}
            onChange={handleTitleChange}
            className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size}`}
            as="h2"
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Here are some of the projects I've worked on recently. Check out my GitHub for more.
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        {isEditMode && (
          <Button variant="outline" size="sm" onClick={handleAddNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {data.items.map((project, index) => (
          <Card key={index} className="overflow-hidden group">
            <div className="aspect-video w-full overflow-hidden">
              <EditableImage
                src={project.photo}
                alt={project.title}
                onChange={(newImage) => handleProjectImageChange(index, newImage)}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                width={500}
                height={300}
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <EditableText
                  value={project.title}
                  onChange={(newTitle) => handleProjectTitleChange(index, newTitle)}
                  className="text-xl font-bold"
                  as="h3"
                />

                {isEditMode && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => handleEditProject(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemoveProject(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <EditableText
                value={project.description}
                onChange={(newDesc) => handleProjectDescriptionChange(index, newDesc)}
                className="mt-2 text-muted-foreground"
                as="p"
                multiline
              />
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Technologies:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-7 text-xs"
                    onClick={() => handleEditProject(index)}
                  >
                    Edit Technologies
                  </Button>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <Button size="sm" variant="outline" asChild>
                  <Link href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Form Dialog */}
      <Dialog
        open={isAddingProject || editingProjectIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingProject(false)
            setEditingProjectIndex(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingProjectIndex !== null ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="E-commerce Platform"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="A brief description of your project"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={projectForm.links.github}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        links: { ...projectForm.links, github: e.target.value },
                      })
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <Label htmlFor="demo">Demo URL</Label>
                  <Input
                    id="demo"
                    value={projectForm.links.demo}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        links: { ...projectForm.links, demo: e.target.value },
                      })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <div>
                <Label>Technologies</Label>
                <div className="space-y-2 mt-2">
                  {projectForm.technologies.map((tech, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={tech}
                        onChange={(e) => handleTechChange(i, e.target.value)}
                        placeholder="Technology name"
                      />
                      <Button size="icon" variant="ghost" onClick={() => removeTech(i)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addTech}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Technology
                  </Button>
                </div>
              </div>
              <div>
                <Label>Project Image</Label>
                <div className="mt-2 border rounded-md p-4">
                  <div className="aspect-video w-full max-w-[300px] mx-auto overflow-hidden">
                    <EditableImage
                      src={projectForm.photo}
                      alt="Project preview"
                      onChange={(newImage) => setProjectForm({ ...projectForm, photo: newImage })}
                      className="object-cover w-full h-full"
                      width={300}
                      height={180}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingProject(false)
                setEditingProjectIndex(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
