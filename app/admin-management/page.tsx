import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminManagement } from "@/components/admin-management"

export default function AdminManagementPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="관리자 관리" text="시스템 관리자 및 사용자 계정을 관리합니다." />
      <AdminManagement />
    </DashboardShell>
  )
}
