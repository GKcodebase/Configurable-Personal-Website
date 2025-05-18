"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import EditableImage from "@/components/editable/editable-image"
import { Plus, Minus, Edit, Award, FileText, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AwardsCertificationsProps {
  data: {
    title: string
    size: string
    awards?: Array<{
      title: string
      organization: string
      date: string
      description: string
      image?: string
    }>
    certifications?: Array<{
      title: string
      organization: string
      date: string
      description: string
      image?: string
      url?: string
    }>
    blogs?: Array<{
      title: string
      date: string
      description: string
      image?: string
      url: string
    }>
  }
  className?: string
}

export default function AwardsCertifications({ data, className = "" }: AwardsCertificationsProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [activeTab, setActiveTab] = useState("awards")
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [editingItemType, setEditingItemType] = useState<"award" | "certification" | "blog">("award")
  const [itemForm, setItemForm] = useState({
    title: "",
    organization: "",
    date: "",
    description: "",
    image: "/placeholder.svg?height=200&width=300",
    url: "",
  })

  // Ensure we have valid arrays for each section
  const awards = data.awards || []
  const certifications = data.certifications || []
  const blogs = data.blogs || []

  // Debug logging
  useEffect(() => {
    console.log("AwardsCertifications data:", data)
  }, [data])

  const handleTitleChange = (newTitle: string) => {
    const updatedData = {
      ...data,
      title: newTitle,
      awards: data.awards || [],
      certifications: data.certifications || [],
      blogs: data.blogs || [],
    }
    updateSection("awardsCertifications", updatedData)
  }

  const handleAddItem = (type: "award" | "certification" | "blog") => {
    console.log(`Adding new ${type}`)
    setEditingItemType(type)

    // Set default values based on item type
    const defaultValues = {
      title: "",
      organization: "",
      date: new Date().getFullYear().toString(),
      description: "Description goes here",
      image: "/placeholder.svg?height=200&width=300",
      url: "",
    }

    // Set specific defaults based on type
    if (type === "certification" || type === "blog") {
      defaultValues.url = "https://example.com"
    }

    if (type !== "blog") {
      defaultValues.organization = "Organization Name"
    }

    console.log("ADD ITEM - Default Values:", JSON.stringify(defaultValues, null, 2))
    setItemForm(defaultValues)
    setEditingItemIndex(null)
    setIsAddingItem(true)
  }

  const handleEditItem = (type: "award" | "certification" | "blog", index: number) => {
    console.log(`Editing ${type} at index ${index}`)
    setEditingItemType(type)

    // Initialize with default values
    let formData = {
      title: "",
      organization: type !== "blog" ? "Organization Name" : "",
      date: "",
      description: "",
      image: "/placeholder.svg?height=200&width=300",
      url: "",
    }

    // Get the item based on type
    let item = null
    if (type === "award" && data.awards && data.awards[index]) {
      item = data.awards[index]
    } else if (type === "certification" && data.certifications && data.certifications[index]) {
      item = data.certifications[index]
    } else if (type === "blog" && data.blogs && data.blogs[index]) {
      item = data.blogs[index]
    }

    // Update form data with item values if available
    if (item) {
      formData = {
        ...formData,
        title: item.title || "",
        date: item.date || "",
        description: item.description || "",
        image: item.image || "/placeholder.svg?height=200&width=300",
      }

      // Add organization for awards and certifications
      if (type !== "blog" && "organization" in item) {
        formData.organization = item.organization || ""
      }

      // Add URL for certifications and blogs
      if ((type === "certification" || type === "blog") && "url" in item) {
        formData.url = item.url || ""
      }
    }

    console.log("EDIT ITEM - Form Data:", JSON.stringify(formData, null, 2))
    setItemForm(formData)
    setEditingItemIndex(index)
    setIsAddingItem(true)
  }

  const handleRemoveItem = (type: "award" | "certification" | "blog", index: number) => {
    // Create a deep copy of the current data
    const updatedData = JSON.parse(JSON.stringify(data))

    // Initialize arrays if they don't exist
    if (!updatedData.awards) updatedData.awards = []
    if (!updatedData.certifications) updatedData.certifications = []
    if (!updatedData.blogs) updatedData.blogs = []

    if (type === "award") {
      updatedData.awards = updatedData.awards.filter((_: any, i: number) => i !== index)
    } else if (type === "certification") {
      updatedData.certifications = updatedData.certifications.filter((_: any, i: number) => i !== index)
    } else if (type === "blog") {
      updatedData.blogs = updatedData.blogs.filter((_: any, i: number) => i !== index)
    }

    updateSection("awardsCertifications", updatedData)
  }

  const handleSaveItem = () => {
    console.log("SAVE ITEM - Form Data:", JSON.stringify(itemForm, null, 2))
    console.log("SAVE ITEM - Current Data:", JSON.stringify(data, null, 2))
    console.log("SAVE ITEM - Type:", editingItemType)
    console.log("SAVE ITEM - Index:", editingItemIndex)

    // Create a deep copy of the current data
    const updatedData = JSON.parse(JSON.stringify(data || {}))

    // Ensure all arrays exist
    updatedData.awards = updatedData.awards || []
    updatedData.certifications = updatedData.certifications || []
    updatedData.blogs = updatedData.blogs || []

    // Create the new item with all required fields
    let newItem = {}

    if (editingItemType === "award") {
      newItem = {
        title: itemForm.title || "",
        organization: itemForm.organization || "",
        date: itemForm.date || "",
        description: itemForm.description || "",
        image: itemForm.image || "/placeholder.svg?height=200&width=300",
        // No URL for awards
      }

      if (editingItemIndex !== null) {
        updatedData.awards[editingItemIndex] = newItem
      } else {
        updatedData.awards.push(newItem)
      }
    } else if (editingItemType === "certification") {
      newItem = {
        title: itemForm.title || "",
        organization: itemForm.organization || "",
        date: itemForm.date || "",
        description: itemForm.description || "",
        image: itemForm.image || "/placeholder.svg?height=200&width=300",
        url: itemForm.url || "", // Include URL for certifications
      }

      if (editingItemIndex !== null) {
        updatedData.certifications[editingItemIndex] = newItem
      } else {
        updatedData.certifications.push(newItem)
      }
    } else if (editingItemType === "blog") {
      newItem = {
        title: itemForm.title || "",
        date: itemForm.date || "",
        description: itemForm.description || "",
        image: itemForm.image || "/placeholder.svg?height=200&width=300",
        url: itemForm.url || "", // Include URL for blogs
      }

      if (editingItemIndex !== null) {
        updatedData.blogs[editingItemIndex] = newItem
      } else {
        updatedData.blogs.push(newItem)
      }
    }

    console.log("SAVE ITEM - New Item:", JSON.stringify(newItem, null, 2))
    console.log("SAVE ITEM - Updated Data:", JSON.stringify(updatedData, null, 2))

    // Update the global state
    updateSection("awardsCertifications", updatedData)

    // Close the dialog
    setIsAddingItem(false)
    setEditingItemIndex(null)
  }

  const handleUpdateItem = (type: "award" | "certification" | "blog", index: number, field: string, value: string) => {
    // Create a deep copy of the current data
    const updatedData = JSON.parse(JSON.stringify(data))

    // Initialize arrays if they don't exist
    if (!updatedData.awards) updatedData.awards = []
    if (!updatedData.certifications) updatedData.certifications = []
    if (!updatedData.blogs) updatedData.blogs = []

    if (type === "award" && updatedData.awards[index]) {
      updatedData.awards[index] = {
        ...updatedData.awards[index],
        [field]: value,
      }
    } else if (type === "certification" && updatedData.certifications[index]) {
      updatedData.certifications[index] = {
        ...updatedData.certifications[index],
        [field]: value,
      }
    } else if (type === "blog" && updatedData.blogs[index]) {
      updatedData.blogs[index] = {
        ...updatedData.blogs[index],
        [field]: value,
      }
    }

    updateSection("awardsCertifications", updatedData)
  }

  // Function to safely get URL from an item
  const getItemUrl = (type: "certification" | "blog", index: number): string => {
    if (type === "certification" && certifications[index] && certifications[index].url) {
      return certifications[index].url || ""
    } else if (type === "blog" && blogs[index] && blogs[index].url) {
      return blogs[index].url || ""
    }
    return ""
  }

  // Function to update URL for an item
  const handleUpdateUrl = (type: "certification" | "blog", index: number, url: string) => {
    const updatedData = JSON.parse(JSON.stringify(data))

    if (!updatedData.certifications) updatedData.certifications = []
    if (!updatedData.blogs) updatedData.blogs = []

    if (type === "certification" && updatedData.certifications[index]) {
      updatedData.certifications[index].url = url
    } else if (type === "blog" && updatedData.blogs[index]) {
      updatedData.blogs[index].url = url
    }

    updateSection("awardsCertifications", updatedData)
  }

  return (
    <div className={`w-full max-w-full ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            Achievements
          </Badge>
          <EditableText
            value={data.title || "Awards, Certifications & Blogs"}
            onChange={handleTitleChange}
            className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size || "text-2xl"}`}
            as="h2"
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Recognitions, qualifications, and insights that showcase my expertise and thought leadership.
          </p>
        </div>
      </div>

      <div className="mt-8 w-full">
        <Tabs defaultValue="awards" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col items-center justify-center mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="awards">Awards</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
            </TabsList>

            {isEditMode && activeTab == "awards"  &&(
              <Button variant="outline" size="sm" onClick={() => handleAddItem( "award")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            )}
            {isEditMode && activeTab == "certifications"  &&(
              <Button variant="outline" size="sm" onClick={() => handleAddItem( "certification")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            )}
                        {isEditMode && activeTab == "blogs"  &&(
              <Button variant="outline" size="sm" onClick={() => handleAddItem( "blog")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Blog
              </Button>
            )}
          </div>

          <TabsContent value="awards" className="mt-6 w-full">
            {awards.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Award className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>No awards added yet.</p>
                {isEditMode && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleAddItem("award")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Award
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awards.map((award, index) => (
                  <Card key={index} className="group relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="h-5 w-5 text-primary" />
                          <EditableText
                            value={award.title}
                            onChange={(newTitle) => handleUpdateItem("award", index, "title", newTitle)}
                            className="text-xl font-bold"
                            as="h3"
                          />
                        </div>

                        {isEditMode && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => handleEditItem("award", index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleRemoveItem("award", index)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {award.image && (
                        <div className="mb-4 h-40 overflow-hidden rounded-md">
                          <EditableImage
                            src={award.image}
                            alt={award.title}
                            onChange={(newImage) => handleUpdateItem("award", index, "image", newImage)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <EditableText
                            value={award.organization}
                            onChange={(newOrg) => handleUpdateItem("award", index, "organization", newOrg)}
                            className="font-medium"
                            as="span"
                          />{" "}
                          • {award.date}
                        </p>
                        <EditableText
                          value={award.description}
                          onChange={(newDesc) => handleUpdateItem("award", index, "description", newDesc)}
                          className="text-muted-foreground"
                          as="p"
                          multiline
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="certifications" className="mt-6 w-full">
            {certifications.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>No certifications added yet.</p>
                {isEditMode && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleAddItem("certification")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <Card key={index} className="group relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="h-5 w-5 text-primary" />
                          <EditableText
                            value={cert.title}
                            onChange={(newTitle) => handleUpdateItem("certification", index, "title", newTitle)}
                            className="text-xl font-bold"
                            as="h3"
                          />
                        </div>

                        {isEditMode && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => handleEditItem("certification", index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveItem("certification", index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {cert.image && (
                        <div className="mb-4 h-40 overflow-hidden rounded-md">
                          <EditableImage
                            src={cert.image}
                            alt={cert.title}
                            onChange={(newImage) => handleUpdateItem("certification", index, "image", newImage)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <EditableText
                            value={cert.organization}
                            onChange={(newOrg) => handleUpdateItem("certification", index, "organization", newOrg)}
                            className="font-medium"
                            as="span"
                          />{" "}
                          • {cert.date}
                        </p>
                        <EditableText
                          value={cert.description}
                          onChange={(newDesc) => handleUpdateItem("certification", index, "description", newDesc)}
                          className="text-muted-foreground"
                          as="p"
                          multiline
                        />

                        {isEditMode ? (
                          <div className="mt-2">
                            <Label htmlFor={`cert-url-${index}`} className="text-xs">
                              Certificate URL
                            </Label>
                            <Input
                              id={`cert-url-${index}`}
                              value={cert.url || ""}
                              onChange={(e) => handleUpdateUrl("certification", index, e.target.value)}
                              placeholder="https://example.com/certificate"
                              className="mt-1 text-sm"
                            />
                          </div>
                        ) : cert.url ? (
                          <Button variant="outline" size="sm" asChild className="mt-2">
                            <a href={cert.url} target="_blank" rel="noopener noreferrer">
                              View Certificate
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blogs" className="mt-6 w-full">
            {blogs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>No blogs added yet.</p>
                {isEditMode && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => handleAddItem("blog")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blog
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <Card key={index} className="group relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 mb-4">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <EditableText
                            value={blog.title}
                            onChange={(newTitle) => handleUpdateItem("blog", index, "title", newTitle)}
                            className="text-xl font-bold"
                            as="h3"
                          />
                        </div>

                        {isEditMode && (
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => handleEditItem("blog", index)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleRemoveItem("blog", index)}>
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {blog.image && (
                        <div className="mb-4 h-40 overflow-hidden rounded-md">
                          <EditableImage
                            src={blog.image}
                            alt={blog.title}
                            onChange={(newImage) => handleUpdateItem("blog", index, "image", newImage)}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{blog.date}</p>
                        <EditableText
                          value={blog.description}
                          onChange={(newDesc) => handleUpdateItem("blog", index, "description", newDesc)}
                          className="text-muted-foreground"
                          as="p"
                          multiline
                        />

                        {isEditMode ? (
                          <div className="mt-2">
                            <Label htmlFor={`blog-url-${index}`} className="text-xs">
                              Blog URL
                            </Label>
                            <Input
                              id={`blog-url-${index}`}
                              value={blog.url || ""}
                              onChange={(e) => handleUpdateUrl("blog", index, e.target.value)}
                              placeholder="https://example.com/blog"
                              className="mt-1 text-sm"
                            />
                          </div>
                        ) : blog.url ? (
                          <Button variant="outline" size="sm" asChild className="mt-2">
                            <a href={blog.url} target="_blank" rel="noopener noreferrer">
                              Read More
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog
        open={isAddingItem}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingItem(false)
            setEditingItemIndex(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItemIndex !== null ? `Edit ${editingItemType}` : `Add ${editingItemType}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={itemForm.title}
                onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                placeholder={`${editingItemType} title`}
              />
            </div>

            {editingItemType !== "blog" && (
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={itemForm.organization}
                  onChange={(e) => setItemForm({ ...itemForm, organization: e.target.value })}
                  placeholder="Organization name"
                />
              </div>
            )}

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={itemForm.date}
                onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })}
                placeholder="e.g., 2023 or May 2023"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Description"
                rows={3}
              />
            </div>

            {(editingItemType === "certification" || editingItemType === "blog") && (
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={itemForm.url || ""}
                  onChange={(e) => {
                    console.log("URL changed:", e.target.value)
                    setItemForm({ ...itemForm, url: e.target.value })
                  }}
                  placeholder="https://example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Link to your {editingItemType === "certification" ? "certificate" : "blog post"}
                </p>
              </div>
            )}

            <div>
              <Label>Image</Label>
              <div className="mt-2 border rounded-md p-4">
                <div className="aspect-video w-full max-w-[300px] mx-auto overflow-hidden">
                  <EditableImage
                    src={itemForm.image}
                    alt="Preview"
                    onChange={(newImage) => setItemForm({ ...itemForm, image: newImage })}
                    className="object-cover w-full h-full"
                    width={300}
                    height={180}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingItem(false)
                setEditingItemIndex(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
