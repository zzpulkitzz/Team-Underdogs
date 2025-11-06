"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthForm } from "@/components/auth-form"
import { Stethoscope } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<"patient" | "doctor" | null>(null)

  useEffect(() => {
    const roleParam = searchParams.get("role") as "patient" | "doctor" | null
    const storedRole = localStorage.getItem("userRole") as "patient" | "doctor" | null

    const selectedRole = roleParam || storedRole

    if (!selectedRole) {
      router.push("/auth/role")
      return
    }

    setRole(selectedRole)
  }, [searchParams, router])

  const handleChangeRole = () => {
    localStorage.removeItem("userRole")
    router.push("/auth/role")
  }

  if (!role) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Veersa</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Veersa Telehealth</h2>
        </div>

        {/* Role Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-2 text-sm capitalize">
            {role === "patient" ? "Patient Account" : "Doctor Account"}
          </Badge>
          <button onClick={handleChangeRole} className="text-sm text-gray-600 hover:text-gray-900 underline">
            Change
          </button>
        </div>

        {/* Auth Tabs */}
        <Card className="border border-gray-200 shadow-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-gray-200">
              <TabsTrigger
                value="login"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Log in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Sign up
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="login" className="mt-0">
                <AuthForm mode="login" role={role} />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <AuthForm mode="signup" role={role} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing you agree to our{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
