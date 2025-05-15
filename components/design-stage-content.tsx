"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Plus, X, FileText } from "lucide-react"

export function DesignStageContent() {
  const [designFiles, setDesignFiles] = useState<File[]>([])
  const [printFiles, setPrintFiles] = useState<File[]>([])
  const [meetingFiles, setMeetingFiles] = useState<File[][]>([[]]) // 여러 그룹의 회의록 파일
  const [specialNotes, setSpecialNotes] = useState("")

  const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDesignFiles(Array.from(e.target.files))
    }
  }

  const handlePrintFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrintFiles(Array.from(e.target.files))
    }
  }

  const handleMeetingFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...meetingFiles]
      newFiles[index] = Array.from(e.target.files)
      setMeetingFiles(newFiles)
    }
  }

  const addMeetingFileGroup = () => {
    setMeetingFiles([...meetingFiles, []])
  }

  const removeMeetingFileGroup = (index: number) => {
    const newFiles = [...meetingFiles]
    newFiles.splice(index, 1)
    setMeetingFiles(newFiles)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>설계 단계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 설계 도면 업로드 */}
        <div className="space-y-2">
          <Label htmlFor="design-files">설계 도면 업로드</Label>
          <div className="flex items-center space-x-2">
            <Input id="design-files" type="file" multiple className="hidden" onChange={handleDesignFileChange} />
            <Button
              variant="outline"
              onClick={() => document.getElementById("design-files")?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              파일 선택
            </Button>
          </div>
          {designFiles.length > 0 && (
            <div className="mt-2 rounded-md border p-2">
              <div className="text-sm font-medium">선택된 파일:</div>
              {designFiles.map((file, i) => (
                <div key={i} className="mt-1 flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3D 프린트 도면 업로드 */}
        <div className="space-y-2">
          <Label htmlFor="print-files">3D 프린트 도면 업로드</Label>
          <div className="flex items-center space-x-2">
            <Input id="print-files" type="file" multiple className="hidden" onChange={handlePrintFileChange} />
            <Button
              variant="outline"
              onClick={() => document.getElementById("print-files")?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              파일 선택
            </Button>
          </div>
          {printFiles.length > 0 && (
            <div className="mt-2 rounded-md border p-2">
              <div className="text-sm font-medium">선택된 파일:</div>
              {printFiles.map((file, i) => (
                <div key={i} className="mt-1 flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 회의록 파일 업로드 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>회의록 파일 업로드</Label>
            <Button variant="ghost" size="sm" onClick={addMeetingFileGroup} className="h-8 px-2">
              <Plus className="h-4 w-4" />
              추가
            </Button>
          </div>

          {meetingFiles.map((fileGroup, groupIndex) => (
            <div key={groupIndex} className="mt-2 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">회의록 #{groupIndex + 1}</div>
                {meetingFiles.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeetingFileGroup(groupIndex)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <Input
                  id={`meeting-files-${groupIndex}`}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMeetingFileChange(e, groupIndex)}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById(`meeting-files-${groupIndex}`)?.click()}
                  className="w-full"
                  size="sm"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  파일 선택
                </Button>
              </div>

              {fileGroup.length > 0 && (
                <div className="mt-2">
                  {fileGroup.map((file, i) => (
                    <div key={i} className="mt-1 flex items-center text-sm">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 특이 사항 */}
        <div className="space-y-2">
          <Label htmlFor="special-notes">특이 사항</Label>
          <Textarea
            id="special-notes"
            placeholder="특이 사항을 입력하세요"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="default">검토 요청</Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
            승인
          </Button>
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
            반려
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
