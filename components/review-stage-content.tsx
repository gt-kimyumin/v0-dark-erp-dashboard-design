"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, FileText } from "lucide-react"
import { useState } from "react"

export function ReviewStageContent() {
  const [reviewNotes, setReviewNotes] = useState("")
  const [feedbackNotes, setFeedbackNotes] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>최종 검토 단계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="design">설계 검토</TabsTrigger>
            <TabsTrigger value="production">제작 검토</TabsTrigger>
            <TabsTrigger value="final">최종 승인</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-4 pt-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-lg font-medium">설계 문서 검토</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>설계 도면.pdf</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">검토 완료</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>3D 프린트 도면.stl</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">수정 필요</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>회의록 #1.docx</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">검토 완료</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="design-review">검토 의견</Label>
              <Textarea
                id="design-review"
                placeholder="설계 검토 의견을 입력하세요"
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-4 pt-4">
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-lg font-medium">제작 품의서 검토</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>회로도 품의서.pdf</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">검토 완료</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>기구물 품의서.pdf</span>
                  </div>
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="text-sm">검토 완료</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="production-review">검토 의견</Label>
              <Textarea
                id="production-review"
                placeholder="제작 검토 의견을 입력하세요"
                rows={4}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="final" className="space-y-4 pt-4">
            <div className="rounded-md border bg-muted/30 p-4">
              <h3 className="mb-2 text-lg font-medium">최종 승인 체크리스트</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-1" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="check-1">모든 설계 문서가 검토되었습니다.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-2" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="check-2">모든 제작 품의서가 승인되었습니다.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-3" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="check-3">품질 테스트가 완료되었습니다.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-4" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="check-4">모든 피드백이 반영되었습니다.</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="check-5" className="h-4 w-4 rounded border-gray-300" />
                  <Label htmlFor="check-5">최종 결과물이 요구사항을 충족합니다.</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="final-approval">최종 승인 의견</Label>
              <Textarea id="final-approval" placeholder="최종 승인 의견을 입력하세요" rows={4} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">이전 단계로</Button>
        <div className="space-x-2">
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
            반려
          </Button>
          <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
            승인
          </Button>
          <Button>완료 처리</Button>
        </div>
      </CardFooter>
    </Card>
  )
}
