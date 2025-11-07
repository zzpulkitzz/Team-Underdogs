"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface NavbarProps {
  variant?: "light" | "dark";
}

export function Navbar({ variant = "light" }: NavbarProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  const isDark = variant === "dark";

  const bgClass = isDark
    ? "bg-slate-900/80 backdrop-blur-sm border-slate-800"
    : "bg-white/90 backdrop-blur border-gray-200";

  const textClass = isDark ? "text-slate-100" : "text-gray-900";
  const hoverClass = isDark ? "hover:text-slate-300" : "hover:text-blue-600";
  const buttonClass = isDark
    ? "bg-teal-500 hover:bg-teal-400 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  // Read role once on mount
  useEffect(() => {
    try {
      const role = localStorage.getItem("userRole");
      if (role) setUserRole(role);
    } catch { }
  }, []);

  const isDoctor = userRole === "doctor";

  // ✅ Role-aware Book flow
  const handleBookNow = () => {
    const nextForPatient = "/intake";
    const nextForDoctor = "/doctor/dashboard"; // or "/doctor/appointments"

    if (!userRole) {
      router.push(`/auth/role?next=${encodeURIComponent(nextForPatient)}`);
      return;
    }

    const next = isDoctor ? nextForDoctor : nextForPatient;
    try {
      localStorage.setItem("redirectAfterSignup", next);
    } catch { }
    router.push(`/auth?role=${userRole}&next=${encodeURIComponent(next)}`);
  };

  return (
    <nav className={`sticky top-0 z-50 border-b ${bgClass}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand always links home */}
        <Link
          href="/"
          className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white hover:text-teal-400" : "text-blue-600 hover:text-blue-700"
            } transition-colors`}
          aria-label="Go to home"
        >
          Veersa Telehealth
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Make top nav "Book Appointment" follow the same role-aware flow */}
          <button
            onClick={handleBookNow}
            className={`${textClass} ${hoverClass} text-sm transition-colors`}
          >
            Book Appointment
          </button>

          {isDoctor && (
            <Link
              href="/doctor/appointments"
              className={`${textClass} ${hoverClass} text-sm transition-colors`}
            >
              My Appointments
            </Link>
          )}

          <Link href="#features" className={`${textClass} ${hoverClass} text-sm transition-colors`}>
            Features
          </Link>

          <Link href="#specialties" className={`${textClass} ${hoverClass} text-sm transition-colors`}>
            Specialities
          </Link>

          <Link href="#faq" className={`${textClass} ${hoverClass} text-sm transition-colors`}>
            FAQ
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleBookNow}
            className={`${buttonClass} rounded-full px-3 sm:px-6 flex items-center gap-2 text-xs sm:text-sm`}
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Book Now</span>
            <span className="sm:hidden">Book</span>
          </Button>

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
  );
}
