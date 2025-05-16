"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Edit } from "lucide-react"
import { useEditContext } from "@/context/edit-context"
import EditableText from "@/components/editable/editable-text"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ContactProps {
  data: {
    title: string
    size: string
    details: {
      email: string
      phone: string
      linkedin: string
      github: string
      twitter: string
      location?: string
      mapUrl?: string
    }
  }
  className?: string
}

export default function Contact({ data, className = "" }: ContactProps) {
  const { updateSection, isEditMode } = useEditContext()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [locationForm, setLocationForm] = useState({
    location: data.details.location || "San Francisco, California",
    mapUrl:
      data.details.mapUrl ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620756370045!5m2!1sen!2sus",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)
    setFormData({ name: "", email: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const handleTitleChange = (newTitle: string) => {
    updateSection("contacts", {
      ...data,
      title: newTitle,
    })
  }

  const handleContactDetailChange = (field: keyof typeof data.details, value: string) => {
    const updatedDetails = {
      ...data.details,
      [field]: value,
    }

    updateSection("contacts", {
      ...data,
      details: updatedDetails,
    })
  }

  const handleEditLocation = () => {
    setLocationForm({
      location: data.details.location || "San Francisco, California",
      mapUrl:
        data.details.mapUrl ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620756370045!5m2!1sen!2sus",
    })
    setIsEditingLocation(true)
  }

  const handleSaveLocation = () => {
    const updatedDetails = {
      ...data.details,
      location: locationForm.location,
      mapUrl: locationForm.mapUrl,
    }

    updateSection("contacts", {
      ...data,
      details: updatedDetails,
    })
    setIsEditingLocation(false)
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge className="px-3 py-1 text-sm" variant="secondary">
            Contact
          </Badge>
          <EditableText
            value={data.title}
            onChange={handleTitleChange}
            className={`font-bold tracking-tighter sm:text-4xl md:text-5xl ${data.size}`}
            as="h2"
          />
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Have a project in mind or want to chat? Feel free to reach out!
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 mt-12">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  required
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {submitSuccess && (
                <p className="text-green-600 dark:text-green-400 text-center">
                  Message sent successfully! I'll get back to you soon.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-bold">Email</h3>
              <p className="text-muted-foreground mt-1">
                <EditableText
                  value={data.details.email}
                  onChange={(value) => handleContactDetailChange("email", value)}
                  as="a"
                  className="hover:underline"
                  href={`mailto:${data.details.email}`}
                />
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="text-xl font-bold">Phone</h3>
              <p className="text-muted-foreground mt-1">
                <EditableText
                  value={data.details.phone}
                  onChange={(value) => handleContactDetailChange("phone", value)}
                  as="a"
                  className="hover:underline"
                  href={`tel:${data.details.phone}`}
                />
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Location</h3>
                {isEditMode && (
                  <Button variant="ghost" size="sm" onClick={handleEditLocation}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{data.details.location || "San Francisco, California"}</p>
            </div>
          </div>
          <Card className="mt-8">
            <CardContent className="p-0">
              <iframe
                src={
                  data.details.mapUrl ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620756370045!5m2!1sen!2sus"
                }
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Map"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location Edit Dialog */}
      <Dialog open={isEditingLocation} onOpenChange={setIsEditingLocation}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={locationForm.location}
                onChange={(e) => setLocationForm({ ...locationForm, location: e.target.value })}
                placeholder="San Francisco, California"
              />
            </div>
            <div>
              <Label htmlFor="mapUrl">Map Embed URL</Label>
              <Input
                id="mapUrl"
                value={locationForm.mapUrl}
                onChange={(e) => setLocationForm({ ...locationForm, mapUrl: e.target.value })}
                placeholder="Google Maps Embed URL"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get this from Google Maps by clicking "Share" and then "Embed a map"
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingLocation(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
