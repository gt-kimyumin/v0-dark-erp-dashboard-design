import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { MonitoringDashboard } from "@/components/monitoring-dashboard"

export default function MonitoringPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Real-Time Monitoring"
        text="Monitor your system metrics and performance in real-time."
      />
      <MonitoringDashboard />
    </DashboardShell>
  )
}
