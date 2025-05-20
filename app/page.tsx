"use client"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import SectionWrapper from "@/components/section-wrapper"
import AwardsCertifications from "@/components/awards-certifications"
import SectionManager from "@/components/section-manager"
import { useThemeContext } from "@/context/theme-context"
import { useEditContext } from "@/context/edit-context"
import { useEffect } from "react"

export default function Home() {
  const { margin, padding } = useThemeContext()
  const { portfolioData, isEditMode, updateSection } = useEditContext()

  // Ensure awardsCertifications section exists with proper structure
  useEffect(() => {
    if (portfolioData) {
      // Check if the section exists and has the required structure
      const needsInitialization =
        !portfolioData.awardsCertifications ||
        !Array.isArray(portfolioData.awardsCertifications.awards) ||
        !Array.isArray(portfolioData.awardsCertifications.certifications) ||
        !Array.isArray(portfolioData.awardsCertifications.blogs)

      if (needsInitialization) {
        console.log("Initializing awardsCertifications section")

        // Get existing data if available
        const existingData = portfolioData.awardsCertifications || {}

        // Create a properly structured section
        const initializedSection = {
          title: existingData.title || "Awards, Certifications & Blogs",
          size: existingData.size || "text-2xl",
          awards: Array.isArray(existingData.awards) ? existingData.awards : [],
          certifications: Array.isArray(existingData.certifications) ? existingData.certifications : [],
          blogs: Array.isArray(existingData.blogs) ? existingData.blogs : [],
        }

        // Update the section
        updateSection("awardsCertifications", initializedSection)
      }
    }
  }, [portfolioData])

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Create a properly structured awards data object to pass to the component
  const awardsData = {
    title: portfolioData.awardsCertifications?.title || "Awards, Certifications & Blogs",
    size: portfolioData.awardsCertifications?.size || "text-2xl",
    awards: Array.isArray(portfolioData.awardsCertifications?.awards) ? portfolioData.awardsCertifications.awards : [],
    certifications: Array.isArray(portfolioData.awardsCertifications?.certifications)
      ? portfolioData.awardsCertifications.certifications
      : [],
    blogs: Array.isArray(portfolioData.awardsCertifications?.blogs) ? portfolioData.awardsCertifications.blogs : [],
  }

  return (
    <main
      className={`min-h-screen ${isEditMode ? "edit-mode" : ""}`}
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <Hero data={portfolioData.title} />

      <SectionWrapper id="about" bgColor="bg-background dark:bg-background">
        <About data={portfolioData.introduction} />
      </SectionWrapper>

      <SectionWrapper id="experience" bgColor="bg-muted dark:bg-muted">
        <Experience data={portfolioData.workExperience} />
      </SectionWrapper>

      <SectionWrapper id="projects" bgColor="bg-background dark:bg-background">
        <Projects data={portfolioData.projects} />
      </SectionWrapper>

      <SectionWrapper id="skills" bgColor="bg-muted dark:bg-muted">
        <Skills data={portfolioData.skills} />
      </SectionWrapper>

      <SectionWrapper id="achievements" bgColor="bg-background dark:bg-background">
        <AwardsCertifications data={awardsData} />
      </SectionWrapper>

      <SectionWrapper id="contact" bgColor="bg-muted dark:bg-muted">
        <Contact data={portfolioData.contacts} />
      </SectionWrapper>

      {/* Render any custom sections that might have been added */}
      {Object.entries(portfolioData).map(([key, section]) => {
        // Skip the standard sections
        if (
          [
            "title",
            "introduction",
            "education",
            "workExperience",
            "projects",
            "skills",
            "contacts",
            "awardsCertifications",
          ].includes(key)
        ) {
          return null
        }

        // Render custom section
        return (
          <SectionWrapper
            key={key}
            id={key}
            bgColor={
              Object.keys(portfolioData).indexOf(key) % 2 === 0
                ? "bg-background dark:bg-background"
                : "bg-muted dark:bg-muted"
            }
          >
            <div className="space-y-6">
              <h2 className={`font-bold tracking-tighter text-center ${section.size || "text-2xl"}`}>
                {section.title}
              </h2>

              {section.content && (
                <div className="max-w-3xl mx-auto">
                  {section.content.map((item, index) => (
                    <div key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: item.text }} />
                  ))}
                </div>
              )}

              {section.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {section.items.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        {item.date && <p className="text-sm text-muted-foreground mb-2">{item.date}</p>}
                        {item.image && (
                          <div className="mb-4 h-40 overflow-hidden rounded-md">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </SectionWrapper>
        )
      })}

      <Footer data={portfolioData.contacts} />

      <SectionManager />
    </main>
  )
}

// Import Card and CardContent for custom sections
import { Card, CardContent } from "@/components/ui/card"
