"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth-form";
import { Stethoscope } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<"patient" | "doctor" | null>(null);

  // Read URL params once
  const urlRole = (searchParams.get("role") as "patient" | "doctor" | null) || null;
  const urlNext = searchParams.get("next");
  const urlTab = searchParams.get("tab"); // optional: ?tab=signup

  // Decide default tab: if user is coming from a funnel, default to signup
  const defaultTab = useMemo<"login" | "signup">(
    () => (urlTab === "signup" || urlNext ? "signup" : "login"),
    [urlNext, urlTab]
  );

  useEffect(() => {
    // Hydration-safe localStorage usage
    try {
      const storedRole = (localStorage.getItem("userRole") as "patient" | "doctor" | null) || null;

      // If URL has role, prefer it and store
      const selectedRole = urlRole || storedRole;
      if (urlRole) localStorage.setItem("userRole", urlRole);

      // If URL has next, store it for post-auth redirect
      if (urlNext) localStorage.setItem("redirectAfterSignup", urlNext);

      if (!selectedRole) {
        // No role chosen → send to role selection, preserving ?next
        const qs = urlNext ? `?next=${encodeURIComponent(urlNext)}` : "";
        router.replace(`/auth/role${qs}`);
        return;
      }

      setRole(selectedRole);
    } catch {
      // If localStorage fails (very rare), still require role from URL
      if (!urlRole) {
        const qs = urlNext ? `?next=${encodeURIComponent(urlNext)}` : "";
        router.replace(`/auth/role${qs}`);
      } else {
        setRole(urlRole);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const handleChangeRole = () => {
    try {
      localStorage.removeItem("userRole");
    } catch { }
    const qs = urlNext ? `?next=${encodeURIComponent(urlNext)}` : "";
    router.push(`/auth/role${qs}`);
  };

  // Called by AuthForm after successful signup/login
  const handleAuthSuccess = () => {
    let target = "/";
    try {
      const fallback = localStorage.getItem("redirectAfterSignup");
      // If no explicit next, send based on role
      const roleDefault = role === "doctor" ? "/doctor/dashboard" : "/intake";
      target = urlNext || fallback || roleDefault;
      // Clean up once used
      localStorage.removeItem("redirectAfterSignup");
    } catch {
      target = urlNext || (role === "doctor" ? "/doctor/dashboard" : "/intake");
    }
    router.push(target);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-700 transition-colors"
              aria-label="Go to home"
            >
              Veersa Telehealth
            </Link>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome to Veersa Telehealth
          </h2>
        </div>

        {/* Role Badge */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <Badge className="bg-blue-100 px-4 py-2 text-sm capitalize text-blue-700 hover:bg-blue-100">
            {role === "patient" ? "Patient Account" : "Doctor Account"}
          </Badge>
          <button
            onClick={handleChangeRole}
            className="text-sm text-gray-600 underline hover:text-gray-900"
          >
            Change
          </button>
        </div>

        {/* Auth Tabs */}
        <Card className="border border-gray-200 shadow-sm">
          <Tabs defaultValue={defaultTab} className="w-full">
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
                <AuthForm mode="login" role={role}  />
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <AuthForm mode="signup" role={role}  />
              </TabsContent>
            </div>
          </Tabs>
        </Card>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-600">
          By continuing you agree to our{" "}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
