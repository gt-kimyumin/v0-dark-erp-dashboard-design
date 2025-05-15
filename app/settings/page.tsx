import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="설정 관리" text="프로젝트 및 설정을 관리하세요." />
    </DashboardShell>
  )
}
