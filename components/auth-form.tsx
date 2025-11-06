"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { validateEmail, validatePassword, validatePasswordMatch } from "@/lib/validators"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  mode: "login" | "signup"
  role: "patient" | "doctor"
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPasswordRules, setShowPasswordRules] = useState(false)

  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Signup form state
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [registrationId, setRegistrationId] = useState("")

  const validateLoginForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignupForm = () => {
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else {
      const passwordError = validatePassword(password)
      if (passwordError) {
        newErrors.password = passwordError
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (role === "patient" && phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number"
    }

    if (role === "doctor") {
      if (!specialty) {
        newErrors.specialty = "Specialty is required"
      }
      if (!registrationId.trim()) {
        newErrors.registrationId = "Medical registration ID is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLoginForm()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call to POST /api/auth/login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.message || "Login failed" })
        toast({
          title: "Login failed",
          description: data.message || "Please try again",
          variant: "destructive",
        })
        return
      }

      // TODO: Store JWT in cookie and redirect
      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      // Redirect to role-based dashboard
      // window.location.href = role === 'patient' ? '/dashboard/patient' : '/dashboard/doctor'
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignupForm()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call to POST /api/auth/signup
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          fullName,
          email,
          password,
          ...(role === "patient" && phone ? { phone } : {}),
          ...(role === "doctor" ? { specialty, registrationId } : {}),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.message || "Sign up failed" })
        toast({
          title: "Sign up failed",
          description: data.message || "Please try again",
          variant: "destructive",
        })
        return
      }

      // TODO: Store JWT in cookie and redirect
      toast({
        title: "Success",
        description: "Account created successfully",
      })

      // Redirect to role-based dashboard
      // window.location.href = role === 'patient' ? '/dashboard/patient' : '/dashboard/doctor'
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isLoginValid = email && password && !isLoading
  const isSignupValid =
    fullName &&
    email &&
    password &&
    confirmPassword &&
    (role === "patient" || (specialty && registrationId)) &&
    !isLoading

  if (mode === "login") {
    return (
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900 font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: "" })
            }}
            className={errors.email ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-900 font-semibold">
              Password
            </Label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: "" })
            }}
            className={errors.password ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errors.submit}</div>
        )}

        <Button
          type="submit"
          disabled={!isLoginValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-lg font-semibold"
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Logging in..." : "Log in"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-10 rounded-lg font-semibold border-gray-300 bg-transparent"
          disabled={isLoading}
        >
          Continue with Google
        </Button>
      </form>
    )
  }

  // Signup form
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-gray-900 font-semibold">
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            if (errors.fullName) setErrors({ ...errors, fullName: "" })
          }}
          className={errors.fullName ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-gray-900 font-semibold">
          Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors({ ...errors, email: "" })
          }}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-gray-900 font-semibold">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setShowPasswordRules(!!e.target.value)
            if (errors.password) setErrors({ ...errors, password: "" })
          }}
          className={errors.password ? "border-red-500" : ""}
          disabled={isLoading}
          onFocus={() => setShowPasswordRules(true)}
          onBlur={() => setShowPasswordRules(false)}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        {showPasswordRules && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-700 space-y-1">
            <p className="font-semibold text-blue-900">Password requirements:</p>
            <ul className="space-y-1">
              <li className={password.length >= 8 ? "text-green-600" : "text-gray-600"}>✓ At least 8 characters</li>
              <li className={/\d/.test(password) ? "text-green-600" : "text-gray-600"}>✓ At least one number</li>
              <li className={/[a-zA-Z]/.test(password) ? "text-green-600" : "text-gray-600"}>✓ At least one letter</li>
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-900 font-semibold">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
          }}
          className={errors.confirmPassword ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      {role === "patient" && (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-900 font-semibold">
            Phone Number <span className="text-gray-500 text-xs font-normal">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 000-0000"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) setErrors({ ...errors, phone: "" })
            }}
            className={errors.phone ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>
      )}

      {role === "doctor" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-gray-900 font-semibold">
              Medical Specialty
            </Label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => {
                setSpecialty(e.target.value)
                if (errors.specialty) setErrors({ ...errors, specialty: "" })
              }}
              className={`w-full px-3 py-2 border rounded-lg bg-white text-gray-900 ${
                errors.specialty ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
            >
              <option value="">Select a specialty</option>
              <option value="cardiology">Cardiology</option>
              <option value="dermatology">Dermatology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="psychiatry">Psychiatry</option>
              <option value="neurology">Neurology</option>
              <option value="orthopedics">Orthopedics</option>
            </select>
            {errors.specialty && <p className="text-sm text-red-500">{errors.specialty}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationId" className="text-gray-900 font-semibold">
              Medical Registration ID
            </Label>
            <Input
              id="registrationId"
              type="text"
              placeholder="e.g., MD123456"
              value={registrationId}
              onChange={(e) => {
                setRegistrationId(e.target.value)
                if (errors.registrationId) setErrors({ ...errors, registrationId: "" })
              }}
              className={errors.registrationId ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.registrationId && <p className="text-sm text-red-500">{errors.registrationId}</p>}
          </div>
        </>
      )}

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errors.submit}</div>
      )}

      <Button
        type="submit"
        disabled={!isSignupValid}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-lg font-semibold"
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-10 rounded-lg font-semibold border-gray-300 bg-transparent"
        disabled={isLoading}
      >
        Continue with Google
      </Button>
    </form>
  )
}
