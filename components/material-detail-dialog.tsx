"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Upload, FileText, Trash, Plus, LinkIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { ProductionMaterial } from "@/types/project"

interface MaterialDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material?: ProductionMaterial
}

interface AttachedFile {
  id: number
  name: string
  date: Date
  type: "견적서" | "사이트 링크" | "기타"
  url?: string
}

interface InspectionFile {
  id: number
  name: string
  date: Date
}

export function MaterialDetailDialog({ open, onOpenChange, material }: MaterialDetailDialogProps) {
  const [expectedArrivalDate, setExpectedArrivalDate] = useState<Date>()
  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState<Date>()
  const [completionDate, setCompletionDate] = useState<Date>()
  const [specialNotes, setSpecialNotes] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [inspectionFiles, setInspectionFiles] = useState<InspectionFile[]>([])
  const [fileUploads, setFileUploads] = useState<{ id: number; files: File[] }[]>([{ id: 1, files: [] }])
  const [attachmentType, setAttachmentType] = useState<"견적서" | "사이트 링크" | "기타">("견적서")
  const [attachmentUrl, setAttachmentUrl] = useState("")

  // 자료가 있을 경우 초기화
  useEffect(() => {
    if (material) {
      // 예시 데이터로 초기화
      setExpectedArrivalDate(new Date(material.registrationDate.getTime() + 7 * 24 * 60 * 60 * 1000)) // 등록일 + 7일
      setEstimatedArrivalDate(new Date(material.registrationDate.getTime() + 10 * 24 * 60 * 60 * 1000)) // 등록일 + 10일
      setCompletionDate(material.status === "입고 완료" ? material.endDate : undefined)
      setSpecialNotes(material.remarks || "")

      // 예시 첨부 파일
      setAttachedFiles([
        {
          id: 1,
          name: "견적서_001.pdf",
          date: new Date(material.registrationDate.getTime() - 2 * 24 * 60 * 60 * 1000),
          type: "견적서",
        },
        {
          id: 2,
          name: "공급업체 사이트",
          date: new Date(material.registrationDate.getTime() - 1 * 24 * 60 * 60 * 1000),
          type: "사이트 링크",
          url: "https://example.com/supplier",
        },
      ])

      // 예시 검수 자료
      if (material.status === "입고 완료") {
        setInspectionFiles([
          {
            id: 1,
            name: "검수보고서_001.pdf",
            date: material.endDate,
          },
        ])
      } else {
        setInspectionFiles([])
      }
    }
  }, [material])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, uploadId: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFileUploads(
        fileUploads.map((upload) =>
          upload.id === uploadId ? { ...upload, files: [...upload.files, ...newFiles] } : upload,
        ),
      )
    }
  }

  const addFileUpload = () => {
    const newId = Math.max(...fileUploads.map((upload) => upload.id), 0) + 1
    setFileUploads([...fileUploads, { id: newId, files: [] }])
  }

  const removeFileUpload = (id: number) => {
    if (fileUploads.length > 1) {
      setFileUploads(fileUploads.filter((upload) => upload.id !== id))
    }
  }

  const removeFile = (uploadId: number, fileIndex: number) => {
    setFileUploads(
      fileUploads.map((upload) => {
        if (upload.id === uploadId) {
          const newFiles = [...upload.files]
          newFiles.splice(fileIndex, 1)
          return { ...upload, files: newFiles }
        }
        return upload
      }),
    )
  }

  const deleteAttachedFile = (id: number) => {
    setAttachedFiles(attachedFiles.filter((file) => file.id !== id))
  }

  const deleteInspectionFile = (id: number) => {
    setInspectionFiles(inspectionFiles.filter((file) => file.id !== id))
  }

  const addAttachment = () => {
    if (attachmentType === "사이트 링크" && !attachmentUrl) {
      alert("사이트 링크를 입력해주세요.")
      return
    }

    const newId = Math.max(...attachedFiles.map((file) => file.id), 0) + 1
    const newFile: AttachedFile = {
      id: newId,
      name: attachmentType === "사이트 링크" ? "공급업체 사이트" : `새 ${attachmentType} ${newId}`,
      date: new Date(),
      type: attachmentType,
    }

    if (attachmentType === "사이트 링크") {
      newFile.url = attachmentUrl
    }

    setAttachedFiles([...attachedFiles, newFile])
    setAttachmentUrl("")
  }

  const uploadInspectionFiles = () => {
    // 실제로는 파일 업로드 API 호출 후 응답을 받아 처리
    const newFiles = fileUploads.flatMap((upload) =>
      upload.files.map((file) => ({
        id: Math.max(...inspectionFiles.map((f) => f.id), 0) + 1 + Math.random(),
        name: file.name,
        date: new Date(),
      })),
    )

    setInspectionFiles([...inspectionFiles, ...newFiles])
    setFileUploads([{ id: 1, files: [] }])
  }

  const handleSave = () => {
    // 저장 로직 구현
    console.log({
      expectedArrivalDate,
      estimatedArrivalDate,
      completionDate,
      specialNotes,
      attachedFiles,
      inspectionFiles,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>부자재 상세 정보</DialogTitle>
          <DialogDescription>
            {material ? `${material.name} (${material.type})` : "부자재 정보를 조회합니다."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* 날짜 정보 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="expected-arrival">입고 예정일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expected-arrival"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expectedArrivalDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expectedArrivalDate ? format(expectedArrivalDate, "yyyy.MM.dd") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expectedArrivalDate}
                    onSelect={setExpectedArrivalDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated-arrival">예상 입고일</Label>
              <Button
                id="estimated-arrival"
                variant="outline"
                className="w-full justify-start text-left font-normal opacity-70"
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {estimatedArrivalDate ? format(estimatedArrivalDate, "yyyy.MM.dd") : "날짜 없음"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completion-date">입고 완료일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="completion-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !completionDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {completionDate ? format(completionDate, "yyyy.MM.dd") : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={completionDate} onSelect={setCompletionDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 견적서/사이트 링크 첨부 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">견적서/사이트 링크</h3>
              <div className="flex items-center space-x-2">
                <select
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={attachmentType}
                  onChange={(e) => setAttachmentType(e.target.value as any)}
                >
                  <option value="견적서">견적서</option>
                  <option value="사이트 링크">사이트 링크</option>
                  <option value="기타">기타</option>
                </select>
                {attachmentType === "사이트 링크" ? (
                  <Input
                    placeholder="URL 입력"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="w-64"
                  />
                ) : (
                  <Input id="attachment-file" type="file" className="w-64" />
                )}
                <Button onClick={addAttachment}>
                  <Plus className="mr-2 h-4 w-4" />
                  추가
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>파일명</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachedFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        첨부된 파일이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attachedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          {file.type === "사이트 링크" ? (
                            <div className="flex items-center">
                              <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {file.name}
                              </a>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              {file.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{file.type}</Badge>
                        </TableCell>
                        <TableCell>{format(file.date, "yyyy.MM.dd")}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteAttachedFile(file.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 발주 관련 특이 사항 */}
          <div className="space-y-2">
            <Label htmlFor="special-notes">발주 관련 특이 사항</Label>
            <Textarea
              id="special-notes"
              placeholder="발주 관련 특이 사항을 입력하세요"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* 검수 자료 첨부 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">검수 자료 첨부</h3>
            <div className="space-y-2">
              {fileUploads.map((upload) => (
                <div key={upload.id} className="mb-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`inspection-file-${upload.id}`} className="text-sm font-medium">
                      파일 #{upload.id}
                    </Label>
                    {fileUploads.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFileUpload(upload.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <Input
                      id={`inspection-file-${upload.id}`}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileChange(e, upload.id)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`inspection-file-${upload.id}`)?.click()}
                      className="w-full"
                      size="sm"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      파일 선택
                    </Button>
                  </div>
                  {upload.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {upload.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {file.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(upload.id, index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={addFileUpload}>
                  <Plus className="mr-2 h-4 w-4" />
                  파일 업로드 추가
                </Button>
                <Button
                  size="sm"
                  onClick={uploadInspectionFiles}
                  disabled={!fileUploads.some((u) => u.files.length > 0)}
                >
                  업로드
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>파일명</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspectionFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        첨부된 검수 자료가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspectionFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{format(file.date, "yyyy.MM.dd")}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteInspectionFile(file.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
