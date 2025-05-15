import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectForm } from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="새 프로젝트 생성" text="새로운 프로젝트 정보를 입력하세요." />
      <ProjectForm />
    </DashboardShell>
  )
}
