import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Play, Calendar, Shield, User, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar variant="light" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Instant
              <br />
              Consultations
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Connect with a doctor in minutes via our secure telehealth platform.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/role">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-lg">
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 py-6 text-base rounded-lg border-gray-300 hover:bg-gray-100 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl aspect-video flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="/doctor-consultation-telehealth-video-call.jpg"
                alt="Doctor consultation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-black mb-12">Key Features</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: Calendar,
              title: "Easy Scheduling",
              description: "Book appointments at your convenience with our online calendar.",
            },
            {
              icon: Shield,
              title: "Secure Video Calls",
              description: "Have private consultations with end-to-end encryption.",
            },
            {
              icon: User,
              title: "Licensed Physicians",
              description: "Receive care from Deact-certified doctors in various fields.",
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              description: "Get medical advice any time or night.",
            },
          ].map((feature, index) => (
            <Card key={index} className="p-6 border-0 bg-white hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-black text-center mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 text-center">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-black mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "Sign Up",
              description: "Create an account and fill out a brief medical history.",
            },
            {
              step: "Choose Specialty",
              description: "Select the type of doctor you need for your consultation.",
            },
            {
              step: "Start Cons",
              description: "Join a video call with your doctor at scheduled time.",
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-black mb-2">{item.step}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-black mb-12">Specialities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Dermatology", "Pediatrics", "Cardiology"].map((specialty, index) => (
            <Card key={index} className="p-6 border border-gray-200 bg-white hover:shadow-md transition cursor-pointer">
              <p className="text-lg font-semibold text-black">{specialty}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-black mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold text-black hover:text-gray-600">
                  What is telehealth?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Telehealth allows you to consult with doctors online via secure video consultation.
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
                  You can book an appointment by signing up and choosing a time that works for you.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600">
          <p>&copy; 2025 Veersa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
