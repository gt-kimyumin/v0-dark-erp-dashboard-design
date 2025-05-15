"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Printer, Clock, FileText, Download } from "lucide-react"

interface PrintJob {
  id: number
  itemName: string
  printer: string
  material: string
  startTime: Date
  estimatedEndTime: Date
  progress: number
  status: "준비중" | "인쇄중" | "일시정지" | "완료" | "오류"
}

export function PrintStatusMonitor() {
  const [activeJobs, setActiveJobs] = useState<PrintJob[]>([
    {
      id: 1,
      itemName: "기어 하우징 프로토타입",
      printer: "Markforged X7",
      material: "카본",
      startTime: new Date(new Date().getTime() - 45 * 60 * 1000), // 45분 전
      estimatedEndTime: new Date(new Date().getTime() + 45 * 60 * 1000), // 45분 후
      progress: 50,
      status: "인쇄중",
    },
  ])

  const [completedJobs, setCompletedJobs] = useState<PrintJob[]>([
    {
      id: 2,
      itemName: "마운팅 브라켓",
      printer: "Ultimaker S5",
      material: "플라스틱",
      startTime: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), // 3시간 전
      estimatedEndTime: new Date(new Date().getTime() - 30 * 60 * 1000), // 30분 전
      progress: 100,
      status: "완료",
    },
  ])

  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] 시스템 초기화 완료`,
    `[${new Date(new Date().getTime() - 5 * 60 * 1000).toLocaleTimeString()}] Markforged X7 프린터 작업 시작: 기어 하우징 프로토타입`,
    `[${new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString()}] Ultimaker S5 프린터 작업 시작: 마운팅 브라켓`,
    `[${new Date(new Date().getTime() - 30 * 60 * 1000).toLocaleTimeString()}] Ultimaker S5 프린터 작업 완료: 마운팅 브라켓`,
  ])
  const [notes, setNotes] = useState("")

  // 3D 프린트 완료 정보
  const completedPrintInfo = {
    equipmentName: "Markforged X7",
    material: "카본",
    usedMaterial: "85cc",
    remainingMaterial: "415cc",
    timeTaken: "1시간 25분",
    resultFileName: "기어_하우징_프로토타입.stl",
  }

  // 진행 중인 작업 진행률 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs((jobs) =>
        jobs
          .map((job) => {
            if (job.status === "인쇄중") {
              const newProgress = Math.min(job.progress + 1, 100)

              // 로그 추가
              if (newProgress % 10 === 0 && newProgress !== job.progress) {
                setSystemLogs((logs) => [
                  `[${new Date().toLocaleTimeString()}] ${job.printer} 프린터 진행률: ${newProgress}% - ${job.itemName}`,
                  ...logs,
                ])
              }

              // 작업 완료 처리
              if (newProgress === 100) {
                setSystemLogs((logs) => [
                  `[${new Date().toLocaleTimeString()}] ${job.printer} 프린터 작업 완료: ${job.itemName}`,
                  ...logs,
                ])

                // 완료된 작업을 completedJobs로 이동
                setCompletedJobs((completed) => [{ ...job, progress: 100, status: "완료" }, ...completed])

                // 활성 작업에서 제거
                return { ...job, progress: newProgress, status: "완료" }
              }

              return { ...job, progress: newProgress }
            }
            return job
          })
          .filter((job) => job.status !== "완료"),
      )
    }, 3000) // 3초마다 업데이트

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: PrintJob["status"]) => {
    switch (status) {
      case "준비중":
        return <Badge variant="outline">준비중</Badge>
      case "인쇄중":
        return <Badge variant="default">인쇄중</Badge>
      case "일시정지":
        return <Badge variant="warning">일시정지</Badge>
      case "완료":
        return <Badge variant="success">완료</Badge>
      case "오류":
        return <Badge variant="destructive">오류</Badge>
    }
  }

  const getRemainingTime = (job: PrintJob) => {
    if (job.status === "완료") return "완료됨"

    const now = new Date()
    const remainingMs = job.estimatedEndTime.getTime() - now.getTime()

    if (remainingMs <= 0) return "곧 완료"

    const remainingMins = Math.floor(remainingMs / (1000 * 60))
    const hours = Math.floor(remainingMins / 60)
    const mins = remainingMins % 60

    return `${hours > 0 ? `${hours}시간 ` : ""}${mins}분 남음`
  }

  return (
    <div className="space-y-6">
      {/* 현재 작업 */}
      {activeJobs.length === 0 ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Printer className="mx-auto h-10 w-10 mb-2" />
              <p>현재 진행 중인 3D 프린트 작업이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        activeJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{job.itemName}</CardTitle>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">프린터</p>
                  <p className="font-medium">{job.printer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">소재</p>
                  <p className="font-medium">{job.material}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">시작 시간</p>
                  <p className="font-medium">{job.startTime.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">잔여 시간</p>
                  <p className="font-medium flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    {getRemainingTime(job)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">진행률: {job.progress}%</p>
                  <p className="text-sm">{job.progress}/100</p>
                </div>
                <Progress value={job.progress} className="h-2" />
              </div>

              <div className="rounded-md border p-2">
                <div className="flex items-center space-x-2">
                  {job.status === "인쇄중" ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-sm">프린팅 진행 중...</p>
                    </>
                  ) : job.status === "오류" ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <p className="text-sm text-destructive">오류가 발생했습니다. 확인이 필요합니다.</p>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      <p className="text-sm">{job.status}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* 시스템 로그 */}
      <Card>
        <CardHeader>
          <CardTitle>시스템 로그</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[150px] w-full">
            {systemLogs.map((log, index) => (
              <div key={index} className="py-1 text-sm">
                {log}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 완료된 작업 */}
      {completedJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>완료된 작업</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedJobs.map((job) => (
              <div key={job.id} className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{job.itemName}</h3>
                  {getStatusBadge(job.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">프린터:</span> {job.printer}
                  </div>
                  <div>
                    <span className="text-muted-foreground">소재:</span> {job.material}
                  </div>
                  <div>
                    <span className="text-muted-foreground">시작 시간:</span> {job.startTime.toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">완료 시간:</span> {job.estimatedEndTime.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3D 프린트 완료 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>3D 프린트 완료 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">장비 이름</p>
              <p className="font-medium">{completedPrintInfo.equipmentName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">소재</p>
              <p className="font-medium">{completedPrintInfo.material}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">소모 소재 정보</p>
              <p className="font-medium">{completedPrintInfo.usedMaterial}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">잔여 소재 정보</p>
              <p className="font-medium">{completedPrintInfo.remainingMaterial}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">소요 시간</p>
              <p className="font-medium">{completedPrintInfo.timeTaken}</p>
            </div>
          </div>

          {/* 결과물 출력 영역 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">결과물</p>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{completedPrintInfo.resultFileName}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="mr-1 h-4 w-4" />
                다운로드
              </Button>
            </div>
          </div>

          {/* 메모 영역 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">메모</p>
            <Textarea
              placeholder="3D 프린트 결과에 대한 메모를 입력하세요"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* 보고서 출력 버튼 */}
          <div className="flex justify-end">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              보고서 출력
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 프린터 영상 */}
      <Card>
        <CardHeader>
          <CardTitle>프린터 영상</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video overflow-hidden rounded-md bg-muted">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Printer className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">프린터 영상 피드</p>
                <p className="text-xs text-muted-foreground">(실제 환경에서는 프린터의 실시간 영상이 표시됩니다)</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline">TBD 다음</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
