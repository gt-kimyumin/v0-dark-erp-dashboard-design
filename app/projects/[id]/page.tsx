import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectDetail } from "@/components/project-detail"
import { notFound } from "next/navigation"

// 이 함수는 실제 환경에서는 데이터베이스에서 프로젝트를 조회하는 로직으로 대체됩니다
async function getProject(id: string) {
  // 샘플 프로젝트 데이터
  const projects = [
    {
      id: 1,
      client: "삼성",
      title: "ERP 시스템 구축",
      worker: "김철수",
      registrar: "이영희",
      startDate: new Date(2025, 0, 15),
      endDate: new Date(2025, 3, 30),
      status: "진행중",
      stage: "설계" as const,
    },
    {
      id: 2,
      client: "LG",
      title: "모바일 앱 개발",
      worker: "박지민",
      registrar: "김민수",
      startDate: new Date(2025, 1, 1),
      endDate: new Date(2025, 4, 15),
      status: "대기",
      stage: "제작" as const,
    },
    {
      id: 3,
      client: "현대",
      title: "웹사이트 리뉴얼",
      worker: "정수진",
      registrar: "이영희",
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2025, 1, 28),
      status: "진행 완료",
      stage: "최종 검토" as const,
    },
    {
      id: 4,
      client: "SK",
      title: "데이터 분석 시스템",
      worker: "한지훈",
      registrar: "김철수",
      startDate: new Date(2025, 2, 10),
      endDate: new Date(2025, 5, 20),
      status: "진행중",
      stage: "완료" as const,
    },
  ]

  const project = projects.find((p) => p.id === Number.parseInt(id))
  return project
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`${project.title}`}
        text={`발주처: ${project.client} | 작업자: ${project.worker} | 등록자: ${project.registrar}`}
      />
      <ProjectDetail project={project} />
    </DashboardShell>
  )
}
