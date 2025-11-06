"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { User, Stethoscope } from "lucide-react"

export default function RoleSelectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (role: "patient" | "doctor") => {
    setIsLoading(true)
    // Store role in localStorage as fallback
    localStorage.setItem("userRole", role)
    // Navigate to auth page with role query param
    router.push(`/auth?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Veersa Telehealth</h1>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Who are you?</h2>
          <p className="text-lg text-gray-600">Choose your account type to get started</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            {
              id: "patient",
              title: "Patient",
              subtitle: "I need a consultation",
              description: "Book & join video consults",
              icon: User,
            },
            {
              id: "doctor",
              title: "Doctor",
              subtitle: "I provide consultations",
              description: "Manage availability & sessions",
              icon: Stethoscope,
            },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id as "patient" | "doctor")}
              disabled={isLoading}
              className="text-left"
            >
              <Card className="p-8 h-full border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-blue-50">
                <div className="flex flex-col h-full">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                    <role.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{role.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{role.subtitle}</p>
                  <p className="text-gray-700 flex-grow">{role.description}</p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold">
                    Get Started
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/auth" className="text-blue-600 font-semibold hover:text-blue-700">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
