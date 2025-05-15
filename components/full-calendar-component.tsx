"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import koLocale from "@fullcalendar/core/locales/ko"

interface FullCalendarComponentProps {
  events: any[]
  viewMode: string
  onDateClick: (info: any) => void
  onEventClick: (info: any) => void
  onDateChange: (date: Date) => void
  calendarRef: any
}

const FullCalendarComponent = forwardRef<any, FullCalendarComponentProps>(
  ({ events, viewMode, onDateClick, onEventClick, onDateChange, calendarRef }, ref) => {
    const internalRef = useRef<any>(null)

    useImperativeHandle(calendarRef, () => ({
      getApi: () => internalRef.current?.getApi(),
    }))

    return (
      <div className="bg-white rounded-lg shadow">
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
            color: #000 !important;
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
        `}</style>
        <FullCalendar
          ref={internalRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={viewMode}
          headerToolbar={false} // 커스텀 헤더를 사용하므로 기본 헤더 비활성화
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          locale={koLocale}
          height="auto"
          dateClick={onDateClick}
          eventClick={onEventClick}
          datesSet={(dateInfo) => onDateChange(dateInfo.view.currentStart)}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
        />
      </div>
    )
  },
)

FullCalendarComponent.displayName = "FullCalendarComponent"

export default FullCalendarComponent
