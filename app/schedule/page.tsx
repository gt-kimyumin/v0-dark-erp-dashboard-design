import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectCalendar } from "@/components/project-calendar"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="일정 관리" text="프로젝트 및 일정을 관리하세요." />
      <ProjectCalendar />
    </DashboardShell>
  )
}
