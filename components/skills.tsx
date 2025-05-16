"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import * as SimpleIcons from "react-icons/si"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Edit } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillsProps {
  data: {
    title: string
    size: string
    categories: {
      [key: string]: Array<{
        name: string
        icon: string | null
      }>
    }
  }
  className?: string
}

export default function Skills({ data, className = "" }: SkillsProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingSkill, setEditingSkill] = useState<{ category: string; index: number } | null>(null)
  const [skillForm, setSkillForm] = useState({
    name: "",
    icon: "",
    category: "",
  })
  const [newCategoryName, setNewCategoryName] = useState("")

  // Function to get icon component from string
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return null

    // Convert icon name to match SimpleIcons naming convention
    // e.g., "react" -> "SiReact"
    const iconKey = `Si${iconName.charAt(0).toUpperCase() + iconName.slice(1)}` as keyof typeof SimpleIcons

    // @ts-ignore - Dynamic access to SimpleIcons
    const IconComponent = SimpleIcons[iconKey]

    return IconComponent ? <IconComponent className="h-6 w-6" /> : null
  }

  const handleTitleChange = (newTitle: string) => {
    updateSection("skills", {
      ...data,
      title: newTitle,
    })
  }

  const handleEditSkill = (category: string, index: number) => {
    const skill = data.categories[category][index]
    setSkillForm({
      name: skill.name,
      icon: skill.icon || "",
      category,
    })
    setEditingSkill({ category, index })
  }

  const handleRemoveSkill = (category: string, index: number) => {
    const updatedCategories = { ...data.categories }
    updatedCategories[category] = updatedCategories[category].filter((_, i) => i !== index)

    // Remove category if empty
    if (updatedCategories[category].length === 0) {
      delete updatedCategories[category]
    }

    updateSection("skills", {
      ...data,
      categories: updatedCategories,
    })
  }

  const handleAddNewSkill = (category?: string) => {
    setSkillForm({
      name: "",
      icon: "",
      category: category || Object.keys(data.categories)[0] || "",
    })
    setIsAddingSkill(true)
  }

  const handleSaveSkill = () => {
    if (editingSkill) {
      // Edit existing skill
      const updatedCategories = { ...data.categories }
      updatedCategories[editingSkill.category][editingSkill.index] = {
        name: skillForm.name,
        icon: skillForm.icon || null,
      }

      updateSection("skills", {
        ...data,
        categories: updatedCategories,
      })

      setEditingSkill(null)
    } else {
      // Add new skill
      const updatedCategories = { ...data.categories }

      if (!updatedCategories[skillForm.category]) {
        updatedCategories[skillForm.category] = []
      }

      updatedCategories[skillForm.category].push({
        name: skillForm.name,
        icon: skillForm.icon || null,
      })

      updateSection("skills", {
        ...data,
        categories: updatedCategories,
      })

      setIsAddingSkill(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const updatedCategories = { ...data.categories }
      updatedCategories[newCategoryName.trim()] = []

      updateSection("skills", {
        ...data,
        categories: updatedCategories,
      })

      setNewCategoryName("")
      setIsAddingCategory(false)
    }
  }

  const handleRemoveCategory = (category: string) => {
    const updatedCategories = { ...data.categories }
    delete updatedCategories[category]

    updateSection("skills", {
      ...data,
      categories: updatedCategories,
    })
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            Skills
          </Badge>
          <EditableText
            value={data.title}
            onChange={handleTitleChange}
            className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size}`}
            as="h2"
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Here are some of the technologies and tools I work with.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-4 mt-8">
        {isEditMode && (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddingCategory(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddNewSkill()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 space-y-8">
        {Object.entries(data.categories).map(([category, skills]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <EditableText
                value={category}
                onChange={(newCategory) => {
                  if (newCategory && newCategory !== category) {
                    const updatedCategories = { ...data.categories }
                    updatedCategories[newCategory] = updatedCategories[category]
                    delete updatedCategories[category]

                    updateSection("skills", {
                      ...data,
                      categories: updatedCategories,
                    })
                  }
                }}
                className="text-xl font-bold capitalize"
                as="h3"
              />

              {isEditMode && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleAddNewSkill(category)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCategory(category)}>
                    <Minus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {skills.map((skill, index) => (
                <Card key={index} className="overflow-hidden group">
                  <CardContent className="p-4 flex flex-col items-center text-center relative">
                    <div className="mb-2 h-10 flex items-center justify-center">
                      {skill.icon ? getIconComponent(skill.icon) : null}
                    </div>
                    <EditableText
                      value={skill.name}
                      onChange={(newName) => {
                        const updatedCategories = { ...data.categories }
                        updatedCategories[category][index] = {
                          ...updatedCategories[category][index],
                          name: newName,
                        }

                        updateSection("skills", {
                          ...data,
                          categories: updatedCategories,
                        })
                      }}
                      className="font-medium"
                      as="p"
                    />

                    {isEditMode && (
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEditSkill(category, index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleRemoveSkill(category, index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Form Dialog */}
      <Dialog
        open={isAddingSkill || editingSkill !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingSkill(false)
            setEditingSkill(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSkill !== null ? "Edit Skill" : "Add New Skill"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="React"
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  placeholder="react"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the icon name from Simple Icons (e.g., "react" for React)
                </p>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={skillForm.category}
                  onValueChange={(value) => setSkillForm({ ...skillForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(data.categories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingSkill(false)
                setEditingSkill(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSkill}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Frontend, Backend, Tools"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
