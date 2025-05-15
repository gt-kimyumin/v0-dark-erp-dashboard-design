"use client"

import type { ProjectStage } from "@/types/project"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectProgressBarProps {
  currentStage: ProjectStage
  onStageChange: (stage: ProjectStage) => void
}

export function ProjectProgressBar({ currentStage, onStageChange }: ProjectProgressBarProps) {
  const stages: ProjectStage[] = ["설계", "제작", "최종 검토", "완료"]
  const currentIndex = stages.indexOf(currentStage)

  // 현재 단계에 따라 활성화할 버튼 결정
  const getEnabledButtons = (): ProjectStage[] => {
    switch (currentStage) {
      case "설계":
        return ["제작"]
      case "제작":
        return ["설계", "최종 검토"]
      case "최종 검토":
        return ["제작", "완료"]
      case "완료":
        return ["최종 검토"]
      default:
        return []
    }
  }

  const enabledButtons = getEnabledButtons()

  // 진행률 계산 (각 단계는 25%씩)
  const progressPercentage = ((currentIndex + 1) / stages.length) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">진행 상태: {currentStage}</div>
        <div className="text-sm text-muted-foreground">{progressPercentage.toFixed(0)}% 완료</div>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
      </div>

      {/* 단계 표시 */}
      <div className="flex justify-between">
        {stages.map((stage, index) => (
          <div key={stage} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                index <= currentIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
              )}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-xs">{stage}</span>
          </div>
        ))}
      </div>

      {/* 상태 변경 버튼 */}
      <div className="flex justify-center space-x-4 pt-4">
        {stages.map((stage) => (
          <Button
            key={stage}
            variant={stage === currentStage ? "default" : "outline"}
            size="sm"
            onClick={() => onStageChange(stage)}
            disabled={!enabledButtons.includes(stage) && stage !== currentStage}
          >
            {stage}
          </Button>
        ))}
      </div>
    </div>
  )
}
