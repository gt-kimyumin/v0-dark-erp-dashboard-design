import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { DeviceManagement } from "@/components/device-management"

export default function DeviceManagementPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="장치 관리" text="3D 프린터 및 기타 장치의 추가, 현황 조회, 사용량 분석을 관리합니다." />
      <DeviceManagement />
    </DashboardShell>
  )
}
