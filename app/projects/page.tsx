import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsTable } from "@/components/projects-table"
import { ProjectSearch } from "@/components/project-search"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="프로젝트" text="프로젝트 목록을 관리하고 새 프로젝트를 생성합니다.">
        <div className="flex items-center gap-4">
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              프로젝트 생성
            </Button>
          </Link>
        </div>
      </DashboardHeader>

      <ProjectSearch />
      <ProjectsTable />
    </DashboardShell>
  )
}
