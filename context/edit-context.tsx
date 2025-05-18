"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the structure of our portfolio data
export interface PortfolioData {
  title: {
    isRequired: boolean
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
  introduction: {
    isRequired: boolean
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
  education: {
    isRequired: boolean
    title: string
    size: string
    items: Array<{
      institution: string
      degree: string
      timePeriod: {
        start: number
        end: number
      }
      gpa?: number
      activities: string[]
      achievements: string[]
    }>
  }
  workExperience: {
    isRequired: boolean
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
  projects: {
    isRequired: boolean
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
  skills: {
    isRequired: boolean
    title: string
    size: string
    categories: {
      [key: string]: Array<{
        name: string
        icon: string | null
      }>
    }
  }
  contacts: {
    isRequired: boolean
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
  awardsCertifications: {
    title: string
    size: string
    awards: Array<{
      title: string
      organization: string
      date: string
      description: string
      image?: string
    }>
    certifications: Array<{
      title: string
      organization: string
      date: string
      description: string
      image?: string
      url?: string
    }>
    blogs: Array<{
      title: string
      date: string
      description: string
      image?: string
      url: string
    }>
  }
  [key: string]: any
}

interface EditContextType {
  isEditMode: boolean
  toggleEditMode: () => void
  portfolioData: PortfolioData | null
  updatePortfolioData: (newData: PortfolioData) => void
  updateSection: <K extends keyof PortfolioData>(section: K, data: PortfolioData[K]) => void
  addItem: <K extends keyof PortfolioData>(section: K, itemsKey: string, newItem: any) => void
  removeItem: <K extends keyof PortfolioData>(section: K, itemsKey: string, index: number) => void
  isDevMode: boolean
}

const defaultPortfolioData: PortfolioData = {
  title: {
    isRequired: true,
    title: "Gokul G.K",
    size: "text-4xl",
    image: "/placeholder.svg?height=400&width=400",
    subtitle: "Full Stack Developer & Project Manager",
    description:
      "I build exceptional digital experiences that are fast, accessible, and visually appealing. Currently focused on building responsive applications.",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  introduction: {
    isRequired: true,
    title: "About Me",
    size: "text-2xl",
    content: [
      {
        paragraph: 1,
        text: "<p>Hi, I'm Gokul G.K, a passionate Full Stack Developer Product Manager with experience in React, JavaScript, and Tailwind CSS. I enjoy building responsive and user-friendly web applications.</p>",
      },
      {
        paragraph: 2,
        text: "<p>I have a strong background in frontend development and a keen interest in modern web technologies.</p>",
      },
    ],
    journey:
      "I started my journey as a self-taught developer, learning HTML, CSS, and JavaScript. Over the years, I've expanded my skills to include modern frameworks like React, Next.js, and various backend technologies. I'm passionate about creating accessible, performant, and beautiful web applications.",
    education: [
      {
        degree: "M.S. in IT Management",
        institution: "University of Technology",
        period: "2018-2022",
      },
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
    ],
  },
  education: {
    isRequired: true,
    title: "Education",
    size: "text-2xl",
    items: [
      {
        institution: "University of Technology",
        degree: "B.S. Computer Science",
        timePeriod: {
          start: 2018,
          end: 2022,
        },
        gpa: 3.8,
        activities: ["Coding Club", "Robotics Club", "Open Source Projects"],
        achievements: ["Dean's List 2020", "Hackathon Winner 2021", "Best Thesis Award 2022"],
      },
      {
        institution: "Tech Bootcamp",
        degree: "Full Stack Web Development",
        timePeriod: {
          start: 2022,
          end: 2022,
        },
        activities: ["Team Projects", "Hackathons"],
        achievements: ["Best Project Award"],
      },
    ],
  },
  workExperience: {
    isRequired: true,
    title: "Work Experience",
    size: "text-2xl",
    items: [
      {
        company: "TechCorp Inc.",
        role: "Senior Frontend Developer",
        timePeriod: {
          start: 2022,
          end: null,
        },
        location: "San Francisco, CA",
        points: [
          "Led the frontend development team in building responsive web applications",
          "Implemented modern frontend practices and improved performance by 40%",
          "Collaborated with designers to implement responsive UI components",
        ],
      },
      {
        company: "WebSolutions",
        role: "Full Stack Developer",
        timePeriod: {
          start: 2020,
          end: 2022,
        },
        location: "New York, NY",
        points: [
          "Developed and maintained full-stack applications using React, Node.js, and MongoDB",
          "Collaborated with designers to implement responsive UI components",
          "Participated in code reviews and mentored junior developers",
        ],
      },
    ],
    skills: [
      {
        title: "Frontend Development",
        icon: "code",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
      },
      {
        title: "Backend Development",
        icon: "briefcase",
        items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Firebase", "RESTful APIs", "GraphQL"],
      },
      {
        title: "UI/UX Design",
        icon: "lightbulb",
        items: ["Figma", "Adobe XD", "Responsive Design", "Wireframing", "Prototyping"],
      },
    ],
  },
  projects: {
    isRequired: true,
    title: "Projects",
    size: "text-2xl",
    items: [
      {
        title: "E-commerce Platform",
        photo: "/placeholder.svg?height=300&width=500",
        links: {
          github: "https://github.com",
          demo: "https://example.com",
        },
        description: "A full-stack e-commerce platform built with Next.js, Stripe, and a headless CMS.",
        technologies: ["Next.js", "Stripe", "Tailwind CSS", "Headless CMS"],
      },
      {
        title: "Task Management App",
        photo: "/placeholder.svg?height=300&width=500",
        links: {
          github: "https://github.com",
          demo: "https://example.com",
        },
        description: "A collaborative task management application with real-time updates and team features.",
        technologies: ["React", "Firebase", "Material UI", "Real-time"],
      },
    ],
  },
  skills: {
    isRequired: true,
    title: "Skills",
    size: "text-2xl",
    categories: {
      frontend: [
        { name: "React", icon: "react" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "HTML5", icon: "html5" },
        { name: "CSS3", icon: "css3" },
      ],
      backend: [
        { name: "Node.js", icon: "nodedotjs" },
        { name: "Express", icon: "express" },
        { name: "MongoDB", icon: "mongodb" },
      ],
      design: [
        { name: "Figma", icon: "figma" },
        { name: "Adobe XD", icon: "adobexd" },
        { name: "UI/UX Design", icon: null },
      ],
    },
  },
  contacts: {
    isRequired: true,
    title: "Contact Me",
    size: "text-2xl",
    details: {
      email: "john.doe@example.com",
      phone: "+1 234 567 890",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      location: "San Francisco, California",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620756370045!5m2!1sen!2sus",
    },
  },
  awardsCertifications: {
    title: "Awards, Certifications & Blogs",
    size: "text-2xl",
    awards: [
      {
        title: "Best Developer Award",
        organization: "Tech Conference 2023",
        date: "2023",
        description: "Recognized for outstanding contributions to open-source development and innovative solutions.",
        image: "/placeholder.svg?height=200&width=300",
      },
    ],
    certifications: [
      {
        title: "AWS Certified Solutions Architect",
        organization: "Amazon Web Services",
        date: "2022",
        description: "Professional certification validating expertise in designing distributed systems on AWS.",
        image: "/placeholder.svg?height=200&width=300",
        url: "https://example.com/certificate",
      },
    ],
    blogs: [
      {
        title: "Building Scalable Web Applications",
        date: "January 2023",
        description: "A comprehensive guide to building web applications that can handle millions of users.",
        image: "/placeholder.svg?height=200&width=300",
        url: "https://example.com/blog",
      },
    ],
  },
}

const EditContext = createContext<EditContextType | undefined>(undefined)

export function useEditContext() {
  const context = useContext(EditContext)
  if (context === undefined) {
    throw new Error("useEditContext must be used within an EditProvider")
  }
  return context
}

export function EditProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)

  // Check if we're in development mode
  const isDevMode = process.env.NEXT_PUBLIC_APP_ENV === "development"

  useEffect(() => {
    // Load data from localStorage on initial render
    const savedData = localStorage.getItem("portfolioData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setPortfolioData(parsedData)
      } catch (error) {
        console.error("Failed to parse portfolio data from localStorage:", error)
        setPortfolioData(defaultPortfolioData)
      }
    } else {
      setPortfolioData(defaultPortfolioData)
    }
  }, [])

  const toggleEditMode = () => {
    if (!isDevMode) return // Only allow toggling in dev mode
    setIsEditMode((prev) => !prev)
  }

  const updatePortfolioData = (newData: PortfolioData) => {
    setPortfolioData(newData)
    localStorage.setItem("portfolioData", JSON.stringify(newData))
  }

  const updateSection = <K extends keyof PortfolioData>(section: K, data: PortfolioData[K]) => {
    if (!portfolioData) return

    // Create a deep copy of the current data to avoid reference issues
    const updatedData = JSON.parse(JSON.stringify(portfolioData))

    // Special handling for awardsCertifications section
    if (section === "awardsCertifications") {
      // Ensure all required arrays exist
      const newData = data as any
      if (!newData.awards) newData.awards = []
      if (!newData.certifications) newData.certifications = []
      if (!newData.blogs) newData.blogs = []

      updatedData[section] = newData
    } else {
      // Normal handling for other sections
      updatedData[section] = data
    }

    // Update state and localStorage
    setPortfolioData(updatedData)
    localStorage.setItem("portfolioData", JSON.stringify(updatedData))

    // Log for debugging
    console.log(`Updated section ${String(section)}:`, updatedData[section])
  }

  const addItem = <K extends keyof PortfolioData>(section: K, itemsKey: string, newItem: any) => {
    if (!portfolioData) return

    const sectionData = { ...portfolioData[section] }

    if (Array.isArray(sectionData[itemsKey])) {
      sectionData[itemsKey] = [...sectionData[itemsKey], newItem]
      updateSection(section, sectionData as any)
    } else if (typeof sectionData[itemsKey] === "object" && sectionData[itemsKey] !== null) {
      // For nested objects like skills.categories
      const categories = { ...sectionData[itemsKey] }
      if (typeof newItem.category === "string" && Array.isArray(categories[newItem.category])) {
        categories[newItem.category] = [...categories[newItem.category], newItem.item]
      } else if (typeof newItem.category === "string" && !categories[newItem.category]) {
        // Create new category
        categories[newItem.category] = [newItem.item]
      }
      sectionData[itemsKey] = categories
      updateSection(section, sectionData as any)
    }
  }

  const removeItem = <K extends keyof PortfolioData>(section: K, itemsKey: string, index: number) => {
    if (!portfolioData) return

    const sectionData = { ...portfolioData[section] }

    if (Array.isArray(sectionData[itemsKey])) {
      sectionData[itemsKey] = sectionData[itemsKey].filter((_, i) => i !== index)
      updateSection(section, sectionData as any)
    } else if (typeof sectionData[itemsKey] === "object" && sectionData[itemsKey] !== null) {
      // For nested objects like skills.categories
      // This requires category and index within that category
      if (typeof index === "object" && index !== null && "category" in index && "index" in index) {
        const { category, index: itemIndex } = index as { category: string; index: number }
        const categories = { ...sectionData[itemsKey] }
        if (Array.isArray(categories[category])) {
          categories[category] = categories[category].filter((_, i) => i !== itemIndex)
          // Remove category if empty
          if (categories[category].length === 0) {
            delete categories[category]
          }
          sectionData[itemsKey] = categories
          updateSection(section, sectionData as any)
        }
      }
    }
  }

  return (
    <EditContext.Provider
      value={{
        isEditMode,
        toggleEditMode,
        portfolioData,
        updatePortfolioData,
        updateSection,
        addItem,
        removeItem,
        isDevMode,
      }}
    >
      {children}
    </EditContext.Provider>
  )
}
