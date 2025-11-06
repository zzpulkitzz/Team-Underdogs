"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface NavbarProps {
  variant?: "light" | "dark"
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const isDark = variant === "dark"
  const bgClass = isDark
    ? "bg-slate-900/80 backdrop-blur-sm border-slate-800"
    : "bg-white border-gray-200"
  const textClass = isDark ? "text-white" : "text-gray-900"
  const hoverClass = isDark ? "hover:text-slate-300" : "hover:text-gray-600"
  const buttonClass = isDark
    ? "bg-teal-500 hover:bg-teal-400 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white"

  // Check user role from localStorage (set during role selection)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole")
      setUserRole(role)
    }
  }, [])

  const isDoctor = userRole === "doctor"

  return (
    <nav className={`sticky top-0 z-50 border-b ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-blue-600"}`}
        >
          Veersa Telehealth
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/book" className={`${textClass} ${hoverClass} transition-colors text-sm`}>
            Book Appointment
          </Link>
          {isDoctor && (
            <Link
              href="/doctor/appointments"
              className={`${textClass} ${hoverClass} transition-colors text-sm`}
            >
              My Appointments
            </Link>
          )}
          <Link href="#features" className={`${textClass} ${hoverClass} transition-colors text-sm`}>
            Features
          </Link>
          <Link
            href="#specialties"
            className={`${textClass} ${hoverClass} transition-colors text-sm`}
          >
            Specialities
          </Link>
          <Link href="#faq" className={`${textClass} ${hoverClass} transition-colors text-sm`}>
            FAQ
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/book">
            <Button
              className={`${buttonClass} rounded-full px-3 sm:px-6 flex items-center gap-2 text-xs sm:text-sm`}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Book Now</span>
              <span className="sm:hidden">Book</span>
            </Button>
          </Link>
          <Link href="/auth/role">
            <Button
              variant={isDark ? "outline" : "default"}
              className={
                isDark
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800 text-xs sm:text-sm px-3 sm:px-6"
                  : "bg-blue-600 hover:bg-blue-700 text-white rounded-full px-3 sm:px-6 text-xs sm:text-sm"
              }
            >
              <span className="hidden sm:inline">Sign Up</span>
              <span className="sm:hidden">Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

