"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, FileText } from "lucide-react"

export function CompletionStageContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>완료 단계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border bg-green-500/10 p-6 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">프로젝트 완료</h2>
          <p className="mt-2 text-muted-foreground">
            모든 단계가 성공적으로 완료되었습니다. 아래에서 최종 결과물을 확인하세요.
          </p>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="mb-4 text-lg font-medium">최종 결과물</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>최종 설계 도면.pdf</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="mr-1 h-4 w-4" />
                다운로드
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>최종 3D 모델.stl</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="mr-1 h-4 w-4" />
                다운로드
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>최종 보고서.docx</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="mr-1 h-4 w-4" />
                다운로드
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>품질 검증 결과.pdf</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="mr-1 h-4 w-4" />
                다운로드
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-md border p-4">
          <h3 className="mb-4 text-lg font-medium">프로젝트 요약</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-sm text-muted-foreground">시작일</div>
              <div className="text-lg font-medium">2025-01-15</div>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-sm text-muted-foreground">종료일</div>
              <div className="text-lg font-medium">2025-04-30</div>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-sm text-muted-foreground">총 작업 기간</div>
              <div className="text-lg font-medium">3개월 15일</div>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <div className="text-sm text-muted-foreground">참여 인원</div>
              <div className="text-lg font-medium">5명</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">이전 단계로</Button>
        <Button>프로젝트 종료</Button>
      </CardFooter>
    </Card>
  )
}
