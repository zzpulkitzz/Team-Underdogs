"use client"

import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { format, isSameDay, parseISO } from "date-fns"
import { motion } from "framer-motion"
import {
  Star,
  Calendar,
  Clock,
  User,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import "react-day-picker/dist/style.css"

// Types
type Slot = {
  start: string
  end: string
}

type Doctor = {
  id: string
  name: string
  specialty: "General" | "Dermatology" | "Pediatrics"
  rating: number
  nextSlots: Slot[]
}

// Generate mock doctors with slots for today and tomorrow
function generateMockDoctors(): Doctor[] {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Priya Sharma",
      specialty: "General",
      rating: 4.8,
      nextSlots: [],
    },
    {
      id: "2",
      name: "Dr. Rajesh Kumar",
      specialty: "Dermatology",
      rating: 4.9,
      nextSlots: [],
    },
    {
      id: "3",
      name: "Dr. Anjali Reddy",
      specialty: "Pediatrics",
      rating: 4.7,
      nextSlots: [],
    },
  ]

  // Add slots for today (if current time is before 6 PM)
  const currentHour = today.getHours()
  if (currentHour < 18) {
    doctors.forEach((doctor) => {
      for (let i = 0; i < 4; i++) {
        const hour = Math.max(currentHour + 1, 10) + i * 2
        if (hour < 18) {
          const slotTime = new Date(today)
          slotTime.setHours(hour, 0, 0, 0)
          slotTime.setMinutes(0)
          slotTime.setSeconds(0)
          slotTime.setMilliseconds(0)
          doctor.nextSlots.push({
            start: slotTime.toISOString(),
            end: new Date(slotTime.getTime() + 30 * 60 * 1000).toISOString(),
          })
        }
      }
    })
  }

  // Add slots for tomorrow (10 AM to 6 PM, every 2 hours)
  doctors.forEach((doctor) => {
    for (let i = 0; i < 4; i++) {
      const slotTime = new Date(tomorrow)
      slotTime.setHours(10 + i * 2, 0, 0, 0)
      slotTime.setMinutes(0)
      slotTime.setSeconds(0)
      slotTime.setMilliseconds(0)
      doctor.nextSlots.push({
        start: slotTime.toISOString(),
        end: new Date(slotTime.getTime() + 30 * 60 * 1000).toISOString(),
      })
    }
  })

  return doctors
}

const mockDoctors = generateMockDoctors()

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All")
  const [selectedSlot, setSelectedSlot] = useState<{ doctorId: string; slot: Slot } | null>(null)

  // Get slots for selected date
  const getSlotsForDate = (doctor: Doctor, date: Date): Slot[] => {
    return doctor.nextSlots.filter((slot) => {
      const slotDate = parseISO(slot.start)
      return isSameDay(slotDate, date)
    })
  }

  // Filter and sort doctors
  const filteredAndSortedDoctors = mockDoctors
    .filter((doctor) => {
      // Filter by specialty
      if (selectedSpecialty !== "All" && doctor.specialty !== selectedSpecialty) {
        return false
      }
      // Filter by date - show only if doctor has slots on selected date
      const slotsForDate = getSlotsForDate(doctor, selectedDate)
      return slotsForDate.length > 0
    })
    .map((doctor) => ({
      ...doctor,
      slotsForDate: getSlotsForDate(doctor, selectedDate),
    }))
    .sort((a, b) => {
      // Sort by rating (highest first)
      return b.rating - a.rating
    })

  // Handle checkout
  const handleCheckout = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first")
      return
    }
    // TODO: Navigate to checkout page
    alert(`Proceeding to checkout with ${selectedSlot.doctorId} at ${format(parseISO(selectedSlot.slot.start), "h:mm a")}`)
  }

  // Format time slot
  const formatSlotTime = (slot: Slot) => {
    return format(parseISO(slot.start), "h:mm a")
  }

  const specialties = ["All", "General", "Dermatology", "Pediatrics"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <Navbar variant="dark" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Left Column - Filters & Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Calendar */}
            <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" aria-hidden="true" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  fromDate={new Date()}
                  className="rounded-lg"
                  classNames={{
                    root: "w-full",
                    months: "w-full",
                    month: "w-full",
                    month_caption: "text-white mb-4",
                    month_grid: "w-full",
                    weekdays: "text-slate-400 mb-2",
                    weekday: "text-sm font-medium",
                    day: "text-slate-300 hover:bg-teal-500/20 rounded-md transition-colors",
                    day_selected: "bg-teal-500 text-white hover:bg-teal-500 hover:text-white",
                    day_today: "font-semibold",
                    day_outside: "text-slate-600",
                    day_disabled: "text-slate-700 cursor-not-allowed",
                  }}
                />
              </CardContent>
            </Card>

            {/* Specialty Filters */}
            <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Specialty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={selectedSpecialty === specialty ? "default" : "outline"}
                      className={
                        selectedSpecialty === specialty
                          ? "bg-teal-500 hover:bg-teal-400 text-white border-teal-500"
                          : "border-slate-700 text-slate-300 hover:bg-slate-800"
                      }
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

          </motion.div>

          {/* Right Column - Doctors List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Available doctors</h2>
              <p className="text-slate-400 text-sm">Sorted by rating</p>
            </div>

            {filteredAndSortedDoctors.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
                <CardContent className="py-12 text-center text-slate-400">
                  No doctors available for the selected date and specialty.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Doctor Info */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                                <User className="h-6 w-6 text-teal-400" aria-hidden="true" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                                  <Badge
                                    variant="outline"
                                    className="border-teal-500/50 text-teal-400 bg-teal-500/10"
                                  >
                                    <Stethoscope className="h-3 w-3 mr-1" aria-hidden="true" />
                                    {doctor.specialty}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                                    <span>{doctor.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Time Slots */}
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
                                <Clock className="h-4 w-4" aria-hidden="true" />
                                <span>Available slots for {format(selectedDate, "MMM d, yyyy")}</span>
                              </div>
                              {doctor.slotsForDate.length === 0 ? (
                                <p className="text-slate-500 text-sm">No slots for this date.</p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {doctor.slotsForDate.slice(0, 6).map((slot, slotIndex) => {
                                    const isSelected =
                                      selectedSlot?.doctorId === doctor.id &&
                                      selectedSlot?.slot.start === slot.start
                                    return (
                                      <Button
                                        key={slotIndex}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedSlot({ doctorId: doctor.id, slot })}
                                        className={
                                          isSelected
                                            ? "bg-teal-500 hover:bg-teal-400 text-white border-teal-500"
                                            : "border-slate-700 text-slate-300 hover:bg-slate-800"
                                        }
                                      >
                                        {formatSlotTime(slot)}
                                      </Button>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Checkout Button */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky bottom-4"
              >
                <Card className="bg-teal-500/10 border-teal-500/50 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Selected slot</p>
                        <p className="text-white font-semibold">
                          {format(parseISO(selectedSlot.slot.start), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Button
                        onClick={handleCheckout}
                        className="bg-teal-500 hover:bg-teal-400 text-white"
                      >
                        Continue to checkout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

