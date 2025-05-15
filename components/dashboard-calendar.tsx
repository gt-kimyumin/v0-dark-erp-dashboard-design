"use client"

import { useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import koLocale from "@fullcalendar/core/locales/ko"

interface DashboardCalendarProps {
  events: any[]
}

export default function DashboardCalendar({ events }: DashboardCalendarProps) {
  const calendarRef = useRef<any>(null)

  return (
    <div className="bg-card rounded-md">
      <style jsx global>{`
        .fc-day-today {
          background-color: rgba(229, 231, 235, 0.3) !important;
        }
        .fc-col-header-cell-cushion,
        .fc-daygrid-day-number,
        .fc-event-title,
        .fc-event-time,
        .fc-list-event-title,
        .fc-list-event-time {
          color: var(--fc-text-color, #000) !important;
          text-decoration: none !important;
        }
        .fc-daygrid-event-dot {
          border-color: currentColor !important;
        }
        .fc-event-title {
          font-weight: 500;
          text-shadow: 0px 0px 2px rgba(255,255,255,0.5);
        }
        .fc-day-sat .fc-daygrid-day-number {
          color: #2563eb !important;
        }
        .fc-day-sun .fc-daygrid-day-number {
          color: #dc2626 !important;
        }
        .fc .fc-toolbar-title {
          font-size: 1.2em;
        }
        .fc-header-toolbar {
          margin-bottom: 0.5em !important;
        }
        .fc-view-harness {
          min-height: 250px;
        }
        :root {
          --fc-text-color: var(--foreground);
          --fc-border-color: var(--border);
        }
        .dark {
          --fc-text-color: #fff;
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "today",
        }}
        events={events}
        height="auto"
        locale={koLocale}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
      />
    </div>
  )
}
