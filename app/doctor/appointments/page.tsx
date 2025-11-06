"use client"

import { useState } from "react"
import { format, parseISO, isPast, isToday, isFuture } from "date-fns"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type AppointmentStatus = "upcoming" | "completed" | "cancelled"

type Appointment = {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  date: string // ISO string
  startTime: string // ISO string
  endTime: string // ISO string
  specialty: string
  status: AppointmentStatus
  notes?: string
}

// Generate mock appointments with today's appointments
function generateMockAppointments(): Appointment[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Create appointments for today at different times
  const todayMorning = new Date(today)
  todayMorning.setHours(10, 0, 0, 0)
  
  const todayAfternoon = new Date(today)
  todayAfternoon.setHours(14, 0, 0, 0)
  
  const todayEvening = new Date(today)
  todayEvening.setHours(16, 0, 0, 0)
  
  // Create a past appointment for today (already completed)
  const todayPast = new Date(today)
  todayPast.setHours(8, 0, 0, 0)

  return [
    {
      id: "1",
      patientName: "John Doe",
      patientEmail: "john.doe@example.com",
      patientPhone: "+1 234-567-8900",
      date: today.toISOString(),
      startTime: todayMorning.toISOString(),
      endTime: new Date(todayMorning.getTime() + 30 * 60 * 1000).toISOString(),
      specialty: "General",
      status: "completed",
      notes: "Routine checkup completed",
    },
    {
      id: "2",
      patientName: "Sarah Wilson",
      patientEmail: "sarah.w@example.com",
      patientPhone: "+1 234-567-8901",
      date: today.toISOString(),
      startTime: todayAfternoon.toISOString(),
      endTime: new Date(todayAfternoon.getTime() + 30 * 60 * 1000).toISOString(),
      specialty: "Dermatology",
      status: "upcoming",
      notes: "Skin condition follow-up",
    },
    {
      id: "3",
      patientName: "David Lee",
      patientEmail: "david.l@example.com",
      patientPhone: "+1 234-567-8902",
      date: today.toISOString(),
      startTime: todayEvening.toISOString(),
      endTime: new Date(todayEvening.getTime() + 30 * 60 * 1000).toISOString(),
      specialty: "Pediatrics",
      status: "upcoming",
    },
    {
      id: "4",
      patientName: "Jane Smith",
      patientEmail: "jane.smith@example.com",
      patientPhone: "+1 234-567-8903",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 10.5 * 60 * 60 * 1000).toISOString(),
      specialty: "Dermatology",
      status: "upcoming",
    },
    {
      id: "5",
      patientName: "Robert Johnson",
      patientEmail: "robert.j@example.com",
      patientPhone: "+1 234-567-8904",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 14.5 * 60 * 60 * 1000).toISOString(),
      specialty: "Pediatrics",
      status: "completed",
      notes: "Prescription provided",
    },
    {
      id: "6",
      patientName: "Emily Davis",
      patientEmail: "emily.d@example.com",
      patientPhone: "+1 234-567-8905",
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      startTime: new Date(Date.now() - 48 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 48 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000).toISOString(),
      specialty: "General",
      status: "cancelled",
      notes: "Patient requested cancellation",
    },
    {
      id: "7",
      patientName: "Michael Brown",
      patientEmail: "michael.b@example.com",
      patientPhone: "+1 234-567-8906",
      date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      startTime: new Date(Date.now() + 48 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 48 * 60 * 60 * 1000 + 15.5 * 60 * 60 * 1000).toISOString(),
      specialty: "Dermatology",
      status: "upcoming",
    },
    {
      id: "8",
      patientName: "Lisa Anderson",
      patientEmail: "lisa.a@example.com",
      patientPhone: "+1 234-567-8907",
      date: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      startTime: new Date(Date.now() + 72 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 72 * 60 * 60 * 1000 + 11.5 * 60 * 60 * 1000).toISOString(),
      specialty: "General",
      status: "upcoming",
    },
  ]
}

const mockAppointments = generateMockAppointments()

export default function DoctorAppointmentsPage() {
  const [appointments] = useState<Appointment[]>(mockAppointments)

  // Filter appointments
  const todayAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(apt.date)
    return isToday(aptDate) && apt.status !== "cancelled"
  })

  // Sort today's appointments by time
  const sortedTodayAppointments = [...todayAppointments].sort((a, b) => {
    const timeA = parseISO(a.startTime).getTime()
    const timeB = parseISO(b.startTime).getTime()
    return timeA - timeB
  })

  // Upcoming appointments (future dates only, excluding today)
  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = parseISO(apt.date)
    return apt.status === "upcoming" && !isToday(aptDate) && isFuture(aptDate)
  })

  // Sort upcoming appointments by date
  const sortedUpcomingAppointments = [...upcomingAppointments].sort((a, b) => {
    const dateA = parseISO(a.date).getTime()
    const dateB = parseISO(b.date).getTime()
    return dateA - dateB
  })

  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled")

  // Get status badge
  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50">
            <AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />
            Cancelled
          </Badge>
        )
    }
  }

  // Format appointment date and time
  const formatAppointmentDateTime = (date: string, startTime: string) => {
    const dateObj = parseISO(date)
    const timeObj = parseISO(startTime)
    return {
      date: format(dateObj, "MMM d, yyyy"),
      time: format(timeObj, "h:mm a"),
      fullDateTime: format(timeObj, "MMM d, yyyy 'at' h:mm a"),
    }
  }

  // Render appointment card
  const renderAppointmentCard = (appointment: Appointment, index: number, highlightToday = false) => {
    const { date, time, fullDateTime } = formatAppointmentDateTime(
      appointment.date,
      appointment.startTime
    )
    const isPastAppointment = isPast(parseISO(appointment.startTime))
    const isTodayAppointment = isToday(parseISO(appointment.date))
    const isNow = isTodayAppointment && !isPastAppointment

    return (
      <motion.div
        key={appointment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card
          className={`bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${
            highlightToday && isTodayAppointment
              ? "border-teal-500/50 bg-teal-500/5"
              : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left side - Patient info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-teal-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{appointment.patientName}</h3>
                      <Badge
                        variant="outline"
                        className="border-slate-700 text-slate-300 bg-slate-800/50 mt-1"
                      >
                        {appointment.specialty}
                      </Badge>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span>{appointment.patientPhone}</span>
                  </div>
                </div>

                {/* Date and time */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span
                      className={
                        isTodayAppointment
                          ? "text-teal-400 font-semibold"
                          : highlightToday
                          ? "text-white"
                          : ""
                      }
                    >
                      {isTodayAppointment ? "Today" : date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span
                      className={
                        isPastAppointment
                          ? "text-slate-500"
                          : isNow
                          ? "text-teal-400 font-semibold"
                          : "text-white"
                      }
                    >
                      {time}
                    </span>
                  </div>
                  {isNow && (
                    <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50">
                      <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                      Next
                    </Badge>
                  )}
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-slate-200">Notes: </span>
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Actions */}
              {appointment.status === "upcoming" && (
                <div className="flex flex-col gap-2 md:min-w-[150px]">
                  <Button
                    className="bg-teal-500 hover:bg-teal-400 text-white"
                    onClick={() => alert(`Starting consultation with ${appointment.patientName}`)}
                  >
                    Start Consultation
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => alert(`Rescheduling appointment with ${appointment.patientName}`)}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => alert(`Cancelling appointment with ${appointment.patientName}`)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation */}
      <Navbar variant="dark" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Appointments</h1>
          <p className="text-slate-400">Manage your scheduled consultations</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="bg-slate-900/40 border-slate-800 mb-6 w-full flex flex-wrap gap-2 p-1">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex-1 min-w-[120px]"
            >
              Today ({todayAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex-1 min-w-[120px]"
            >
              Upcoming ({sortedUpcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex-1 min-w-[120px]"
            >
              Completed ({completedAppointments.length})
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-white flex-1 min-w-[120px]"
            >
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          {/* Today's Appointments */}
          <TabsContent value="today" className="space-y-4">
            {sortedTodayAppointments.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
                <CardContent className="py-12 text-center text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-600" aria-hidden="true" />
                  <p>No appointments scheduled for today</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4 p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                  <p className="text-teal-400 font-semibold">
                    You have {sortedTodayAppointments.length} appointment
                    {sortedTodayAppointments.length !== 1 ? "s" : ""} scheduled for today
                  </p>
                </div>
                {sortedTodayAppointments.map((appointment, index) =>
                  renderAppointmentCard(appointment, index, true)
                )}
              </>
            )}
          </TabsContent>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming" className="space-y-4">
            {sortedUpcomingAppointments.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
                <CardContent className="py-12 text-center text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-600" aria-hidden="true" />
                  <p>No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              sortedUpcomingAppointments.map((appointment, index) =>
                renderAppointmentCard(appointment, index)
              )
            )}
          </TabsContent>

          {/* Completed Appointments */}
          <TabsContent value="completed" className="space-y-4">
            {completedAppointments.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
                <CardContent className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-slate-600" aria-hidden="true" />
                  <p>No completed appointments</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map((appointment, index) =>
                renderAppointmentCard(appointment, index)
              )
            )}
          </TabsContent>

          {/* Cancelled Appointments */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledAppointments.length === 0 ? (
              <Card className="bg-slate-900/40 border-slate-800 rounded-2xl shadow-lg">
                <CardContent className="py-12 text-center text-slate-400">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-slate-600" aria-hidden="true" />
                  <p>No cancelled appointments</p>
                </CardContent>
              </Card>
            ) : (
              cancelledAppointments.map((appointment, index) =>
                renderAppointmentCard(appointment, index)
              )
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

