"use client"

import { useState } from "react"
import type { Project, ProjectStage } from "@/types/project"
import { ProjectProgressBar } from "@/components/project-progress-bar"
import { ProjectCalendar } from "@/components/project-calendar"
import { DesignStageContent } from "@/components/design-stage-content"
import { ProductionStageContent } from "@/components/production-stage-content"
import { ReviewStageContent } from "@/components/review-stage-content"
import { CompletionStageContent } from "@/components/completion-stage-content"

interface ProjectDetailProps {
  project: Project & { stage: ProjectStage }
}

export function ProjectDetail({ project: initialProject }: ProjectDetailProps) {
  const [project, setProject] = useState(initialProject)
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(), // 현재 날짜를 기본값으로 설정
    to: undefined,
  })

  const handleStageChange = (newStage: ProjectStage) => {
    setProject({ ...project, stage: newStage })
  }

  const renderStageContent = () => {
    switch (project.stage) {
      case "설계":
        return <DesignStageContent />
      case "제작":
        return <ProductionStageContent />
      case "최종 검토":
        return <ReviewStageContent />
      case "완료":
        return <CompletionStageContent />
      default:
        return <div>상태 정보가 없습니다.</div>
    }
  }

  return (
    <div className="space-y-6">
      <ProjectProgressBar currentStage={project.stage} onStageChange={handleStageChange} />

      <div className="grid grid-cols-12 gap-6">
        {/* 좌측 영역 (1/4) */}
        <div className="col-span-3 space-y-6">
          <ProjectCalendar selectedRange={selectedDateRange} onRangeChange={setSelectedDateRange} />
        </div>

        {/* 우측 영역 (3/4) */}
        <div className="col-span-9">{renderStageContent()}</div>
      </div>
    </div>
  )
}
