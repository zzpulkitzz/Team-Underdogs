"use client";

import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Stethoscope, CalendarDays, UserRound, ChevronRight } from "lucide-react";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------- Schema ----------
const intakeSchema = z.object({
    fullName: z.string().min(2, "Please enter your full name"),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
        required_error: "Please select a gender",
    }),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(8, "Enter a valid phone"),
    city: z.string().optional(),
    chiefComplaint: z.string().min(2, "What brings you in today?"),
    symptoms: z.string().min(10, "Please add at least 10 characters").max(800, "Max 800 characters"),
    onset: z.enum(["Today", "1–3 days", "1–2 weeks", ">2 weeks"]),
    severity: z.number().min(1).max(10),
    conditions: z.string().optional(),
    surgeries: z.string().optional(),
    familyHistory: z.string().optional(),
    medications: z.string().optional(),
    allergies: z.string().optional(),
    smoking: z.enum(["Yes", "No"]).optional(),
    alcohol: z.enum(["None", "Occasional", "Regular"]).optional(),
    preferredSpecialty: z.enum(["General", "Dermatology", "Pediatrics", "Psych", "Gyn", "Other"]),
    preferredTime: z.enum(["Morning", "Afternoon", "Evening"]),
    acceptTerms: z.boolean().refine((v) => v, "You must consent to proceed"),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;
const DRAFT_KEY = "veersa:intake-draft";

// ---------- Page ----------
export default function IntakePage() {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm<IntakeFormValues>({
        resolver: zodResolver(intakeSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            dob: "",
            gender: "Prefer not to say",
            email: "",
            phone: "",
            city: "",
            chiefComplaint: "",
            symptoms: "",
            onset: "Today",
            severity: 5,
            conditions: "",
            surgeries: "",
            familyHistory: "",
            medications: "",
            allergies: "",
            smoking: "No",
            alcohol: "None",
            preferredSpecialty: "General",
            preferredTime: "Morning",
            acceptTerms: false,
        },
    });

    // Load draft from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<IntakeFormValues>;
                Object.entries(parsed).forEach(([k, v]) => {
                    // @ts-ignore
                    setValue(k, v, { shouldValidate: true });
                });
            }
        } catch { }
    }, [setValue]);

    const onSubmit = async (values: IntakeFormValues) => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
        const sp = encodeURIComponent(values.preferredSpecialty.toLowerCase());
        router.push(`/book?prefSpecialty=${sp}`);
    };

    const saveDraft = () => {
        const current = watch();
        localStorage.setItem(DRAFT_KEY, JSON.stringify(current));
        alert("Draft saved.");
    };

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            {/* Header (light to match landing) */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        Veersa Telehealth
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CalendarDays className="h-4 w-4" />
                        Intake
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-6 text-2xl font-semibold text-gray-900"
                >
                    Patient Intake Form
                </motion.h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Patient Details */}
                    <SectionCard title="Patient details" badge="Step 1">
                        <Field label="Full name" error={errors.fullName?.message}>
                            <input
                                {...register("fullName")}
                                placeholder="e.g., Aditi Sharma"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Date of birth" error={errors.dob?.message}>
                                <input
                                    type="date"
                                    {...register("dob")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </Field>
                            <Field label="Gender" error={errors.gender?.message}>
                                <select
                                    {...register("gender")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>
                    </SectionCard>

                    {/* Contact */}
                    <SectionCard title="Contact" badge="Step 2">
                        <div className="grid grid-cols-1 gap-3">
                            <Field label="Email" error={errors.email?.message}>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="you@email.com"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </Field>
                            <Field label="Phone" error={errors.phone?.message}>
                                <input
                                    type="tel"
                                    {...register("phone")}
                                    placeholder="+91 9xxxxxxxxx"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </Field>
                            <Field label="City (optional)" error={errors.city?.message}>
                                <input
                                    {...register("city")}
                                    placeholder="e.g., New Delhi"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* Visit Reason */}
                    <SectionCard title="Visit reason" badge="Step 3">
                        <Field label="Chief complaint" error={errors.chiefComplaint?.message}>
                            <input
                                {...register("chiefComplaint")}
                                placeholder="e.g., skin rash on arms"
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>

                        <Field
                            label="Symptoms"
                            helper="Duration, triggers, previous remedies…"
                            error={errors.symptoms?.message}
                        >
                            <textarea
                                {...register("symptoms")}
                                rows={5}
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Onset" error={errors.onset?.message}>
                                <select
                                    {...register("onset")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["Today", "1–3 days", "1–2 weeks", ">2 weeks"].map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label={`Severity: ${watch("severity")}/10`} error={errors.severity?.message}>
                                <Controller
                                    control={control}
                                    name="severity"
                                    render={({ field }) => (
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            step={1}
                                            value={field.value}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            className="w-full accent-blue-600"
                                        />
                                    )}
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* Medical History */}
                    <SectionCard title="Medical history" badge="Step 4 (optional)">
                        <Field label="Existing conditions">
                            <textarea
                                {...register("conditions")}
                                rows={3}
                                placeholder="e.g., diabetes, hypertension"
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>
                        <Field label="Past surgeries">
                            <textarea
                                {...register("surgeries")}
                                rows={3}
                                placeholder="e.g., appendectomy (2019)"
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>
                        <Field label="Family history">
                            <textarea
                                {...register("familyHistory")}
                                rows={3}
                                placeholder="e.g., heart disease in immediate family"
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>
                    </SectionCard>

                    {/* Meds & Allergies */}
                    <SectionCard title="Medications & allergies" badge="Step 5 (optional)">
                        <Field label="Current medications" helper="One per line: Name, dosage">
                            <textarea
                                {...register("medications")}
                                rows={3}
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>
                        <Field label="Allergies">
                            <textarea
                                {...register("allergies")}
                                rows={3}
                                placeholder="e.g., penicillin (rash) — or 'None'"
                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                        </Field>
                    </SectionCard>

                    {/* Lifestyle & Preferences */}
                    <SectionCard title="Lifestyle & preferences" badge="Step 6">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Smoking">
                                <select
                                    {...register("smoking")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["Yes", "No"].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Alcohol">
                                <select
                                    {...register("alcohol")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["None", "Occasional", "Regular"].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Preferred specialty">
                                <select
                                    {...register("preferredSpecialty")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["General", "Dermatology", "Pediatrics", "Psych", "Gyn", "Other"].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Preferred time of day">
                                <select
                                    {...register("preferredTime")}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                                >
                                    {["Morning", "Afternoon", "Evening"].map((v) => (
                                        <option key={v} value={v}>
                                            {v}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <input
                                id="accept"
                                type="checkbox"
                                {...register("acceptTerms")}
                                className="h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500/30"
                            />
                            <label htmlFor="accept" className="text-gray-700">
                                I consent to telehealth and data processing.
                            </label>
                        </div>
                        {errors.acceptTerms?.message && (
                            <p className="mt-1 text-xs text-red-500">{errors.acceptTerms.message}</p>
                        )}
                    </SectionCard>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                    <Button
                        variant="outline"
                        onClick={saveDraft}
                        className="border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                    >
                        Save draft
                    </Button>

                    <form onSubmit={handleSubmit(onSubmit)} className="contents">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Continue to booking
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </form>
                </motion.div>

                {/* Footer help */}
                <p className="mt-4 text-xs text-gray-500">
                    This service does not replace emergency care. If this is urgent, please contact local emergency services.
                </p>
            </div>
        </main>
    );
}

// ---------- Small helpers ----------
function SectionCard({
    title,
    badge,
    children,
}: {
    title: string;
    badge?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
        >
            <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                        <UserRound className="h-5 w-5 text-blue-600" aria-hidden />
                        {title}
                    </CardTitle>
                    {badge && <Badge className="bg-blue-50 text-blue-700">{badge}</Badge>}
                </CardHeader>
                <CardContent className="space-y-3">{children}</CardContent>
            </Card>
        </motion.div>
    );
}

function Field({
    label,
    error,
    helper,
    children,
}: {
    label: string;
    error?: string;
    helper?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-1 text-sm text-gray-800">{label}</div>
            {children}
            {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
