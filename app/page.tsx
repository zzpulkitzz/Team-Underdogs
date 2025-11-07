import Link from "next/link"
import { Calendar, Shield, User, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navbar } from "@/components/navbar"
import { ImagesSlider } from "@/components/image-slider"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar variant="light" />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-black md:text-6xl">
              Instant
              <br />
              Consultations
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              Connect with a doctor in minutes via our secure telehealth platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/role">
                <Button className="rounded-lg bg-blue-600 px-8 py-6 text-base text-white hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/intake">
                <Button
                  variant="outline"
                  className="rounded-lg border-gray-300 bg-transparent px-8 py-6 text-base hover:bg-gray-100"
                >
                  Start Patient Intake
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Images Slider (replaces video) */}
          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-lg">
              <ImagesSlider
                images={[
                  "/hero/image1.jpg",
                  "/hero/image2.jpg",
                  "/hero/image3.jpg",
                ]}
                autoplay
                direction="up"
                overlay
                overlayClassName="bg-black/35"
                className="h-full w-full"
              >
                {/* Optional overlay content */}
                <div className="absolute inset-0 z-50 flex items-end p-4 md:p-6">
                  <div className="rounded-xl bg-white/80 px-4 py-3 backdrop-blur-md shadow">
                    <p className="text-sm text-gray-700">
                      Secure HD calls • Licensed doctors • 24/7 availability
                    </p>
                  </div>
                </div>
              </ImagesSlider>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-4xl font-bold text-black">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              icon: Calendar,
              title: "Easy Scheduling",
              description: "Book appointments at your convenience with our online calendar.",
            },
            {
              icon: Shield,
              title: "Secure Video Calls",
              description: "Private consultations with end-to-end encryption.",
            },
            {
              icon: User,
              title: "Licensed Physicians",
              description: "Receive care from licensed doctors across multiple specialties.",
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              description: "Get medical advice any time, day or night.",
            },
          ].map((feature, i) => (
            <Card key={i} className="transform border-0 bg-white p-6 transition hover:shadow-md">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-lg font-semibold text-black">{feature.title}</h3>
              <p className="text-center text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-4xl font-bold text-black">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "Sign Up", description: "Create an account and fill out a brief medical history." },
            { step: "Fill Details", description: "Fill out medical history and the problem you are facing." },
            { step: "Choose Specialty", description: "Select the type of doctor you need for your consultation." },
            { step: "Book Appointment", description: "Select the date and time you want to consult the doctor." },
            { step: "Start Consult", description: "Join a video call with your doctor at the scheduled time." },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-xl font-semibold text-black">{item.step}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section id="specialties" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-4xl font-bold text-black">Specialties</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Dermatology", "Pediatrics", "Cardiology", "Psychiatry", "Neurology", "Orthopedics"].map((s, i) => (
            <Card
              key={i}
              className="cursor-pointer border border-gray-200 bg-white p-6 transition hover:shadow-md"
            >
              <p className="text-lg font-semibold text-black">{s}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-12 text-4xl font-bold text-black">Frequently Asked Questions</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-black hover:text-gray-600">
                  What is telehealth?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Telehealth lets you consult with doctors online via secure video, without visiting a clinic.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold text-black hover:text-gray-600">
                  How do I book an appointment?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Sign up, choose your specialty, pick a time, and confirm your booking online.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold text-black hover:text-gray-600">
                  What about privacy of Patient Data?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We take the privacy of your data seriously. All your data is encrypted and stored securely.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold text-black hover:text-gray-600">
                  What are payment options?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept all major credit cards and debit cards. You can also pay via bank transfer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-gray-600">
          <p>&copy; 2025 Veersa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
