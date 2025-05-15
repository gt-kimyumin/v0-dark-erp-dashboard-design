import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="설정 관리" text="사이트의 설정을 관리하세요." />
    </DashboardShell>
  )
}
