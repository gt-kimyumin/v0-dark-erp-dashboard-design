import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function Home() {
  return (
    <DashboardShell>
      <DashboardHeader heading="대시보드" text="ERP 시스템의 전체 현황을 확인할 수 있습니다." />
      <DashboardOverview />
    </DashboardShell>
  )
}
