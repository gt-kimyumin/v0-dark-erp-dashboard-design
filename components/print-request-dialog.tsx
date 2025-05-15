"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Upload, FileText, Trash, CuboidIcon as Cube } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PrintRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface DesignFile {
  id: number
  name: string
  date: Date
  previewUrl?: string
}

interface Printer {
  id: number
  name: string
  status: "대기중" | "작업중" | "점검중"
  remainingMaterial: string
}

export function PrintRequestDialog({ open, onOpenChange }: PrintRequestDialogProps) {
  const [itemName, setItemName] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [designFiles, setDesignFiles] = useState<DesignFile[]>([])
  const [selectedFile, setSelectedFile] = useState<DesignFile | null>(null)
  const [estimatedTime, setEstimatedTime] = useState("1시간 30분")
  const [estimatedMaterial, setEstimatedMaterial] = useState("카본 100 cc")
  const [materialType, setMaterialType] = useState<"카본" | "플라스틱" | "오닉스">("카본")
  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(null)
  const [ignoreInventory, setIgnoreInventory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 예시 프린터 목록
  const printers: Printer[] = [
    { id: 1, name: "Markforged X7", status: "대기중", remainingMaterial: "카본 500cc" },
    { id: 2, name: "Ultimaker S5", status: "작업중", remainingMaterial: "플라스틱 300cc" },
    { id: 3, name: "Formlabs Form 3", status: "대기중", remainingMaterial: "오닉스 200cc" },
    { id: 4, name: "Prusa i3 MK3S+", status: "점검중", remainingMaterial: "플라스틱 150cc" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: DesignFile[] = Array.from(e.target.files).map((file, index) => {
        const id = Math.random()
        // 실제로는 파일을 서버에 업로드하고 URL을 받아와야 함
        // 여기서는 예시로 로컬 URL 생성
        const previewUrl = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined

        return {
          id,
          name: file.name,
          date: new Date(),
          previewUrl,
        }
      })

      setDesignFiles([...designFiles, ...newFiles])

      // 첫 번째 파일을 선택된 파일로 설정
      if (newFiles.length > 0 && !selectedFile) {
        setSelectedFile(newFiles[0])
      }
    }
  }

  const deleteFile = (id: number) => {
    const fileToDelete = designFiles.find((file) => file.id === id)
    if (fileToDelete?.previewUrl) {
      URL.revokeObjectURL(fileToDelete.previewUrl)
    }

    setDesignFiles(designFiles.filter((file) => file.id !== id))

    // 선택된 파일이 삭제된 경우 선택 초기화
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(designFiles.length > 1 ? designFiles.find((file) => file.id !== id) || null : null)
    }
  }

  const selectFile = (file: DesignFile) => {
    setSelectedFile(file)
  }

  const handleSubmit = () => {
    // 실제로는 서버에 요청을 보내는 로직 구현
    console.log({
      itemName,
      startDate,
      designFiles,
      selectedFile,
      estimatedTime,
      estimatedMaterial,
      materialType,
      selectedPrinter,
      ignoreInventory,
    })

    // 폼 초기화 및 다이얼로그 닫기
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setItemName("")
    setStartDate(undefined)
    // 미리보기 URL 정리
    designFiles.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
    })
    setDesignFiles([])
    setSelectedFile(null)
    setEstimatedTime("1시간 30분")
    setEstimatedMaterial("카본 100 cc")
    setMaterialType("카본")
    setSelectedPrinter(null)
    setIgnoreInventory(false)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>3D 프린트 요청</DialogTitle>
          <DialogDescription>3D 프린트 작업을 요청하기 위한 정보를 입력하세요.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item-name">품목명</Label>
              <Input
                id="item-name"
                placeholder="품목명 입력 (최대 20자)"
                maxLength={20}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date">시작일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy.MM.dd") : "시작일 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>설계 파일 선택</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="design-file"
                  type="file"
                  className="hidden"
                  accept=".stl,.obj,.3mf,.gcode"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  multiple
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  type="button"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  파일 선택
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
                  {designFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        첨부된 설계 파일이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    designFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        className={cn("cursor-pointer", selectedFile?.id === file.id && "bg-muted")}
                        onClick={() => selectFile(file)}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            {file.name}
                          </div>
                        </TableCell>
                        <TableCell>{format(file.date, "yyyy.MM.dd HH:mm")}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteFile(file.id)
                            }}
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Label>설계 도면 미리보기</Label>
              <Card className="overflow-hidden">
                <CardContent className="flex h-[200px] items-center justify-center p-6">
                  {selectedFile?.previewUrl ? (
                    <img
                      src={selectedFile.previewUrl || "/placeholder.svg"}
                      alt="설계 도면 미리보기"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Cube className="h-16 w-16 mb-2" />
                      <p className="text-sm">미리보기를 사용할 수 없습니다.</p>
                      <p className="text-xs">STL, OBJ, 3MF 또는 GCODE 파일을 선택하세요.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div>
                <Label>프린트 예상 정보</Label>
                <div className="mt-2 rounded-md border p-4">
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="estimated-time" className="text-sm text-muted-foreground">
                        예상 소모 시간
                      </Label>
                      <Input
                        id="estimated-time"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated-material" className="text-sm text-muted-foreground">
                        예상 소모 소재
                      </Label>
                      <Input
                        id="estimated-material"
                        value={estimatedMaterial}
                        onChange={(e) => setEstimatedMaterial(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="material-type" className="text-sm text-muted-foreground">
                      소재 선택
                    </Label>
                    <Select
                      value={materialType}
                      onValueChange={(value: "카본" | "플라스틱" | "오닉스") => setMaterialType(value)}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue placeholder="소재 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="카본">카본</SelectItem>
                        <SelectItem value="플라스틱">플라스틱</SelectItem>
                        <SelectItem value="오닉스">오닉스</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>프린트 장비 선택</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ignore-inventory"
                  checked={ignoreInventory}
                  onCheckedChange={(checked) => setIgnoreInventory(checked === true)}
                />
                <Label htmlFor="ignore-inventory" className="text-sm">
                  재고 무시하고 진행
                </Label>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">선택</TableHead>
                    <TableHead>장비명</TableHead>
                    <TableHead>작업 상태</TableHead>
                    <TableHead>잔여 소재</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printers.map((printer) => (
                    <TableRow key={printer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPrinter === printer.id}
                          onCheckedChange={() => setSelectedPrinter(printer.id)}
                          disabled={printer.status !== "대기중" && !ignoreInventory}
                        />
                      </TableCell>
                      <TableCell>{printer.name}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                            printer.status === "대기중" &&
                              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                            printer.status === "작업중" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                            printer.status === "점검중" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                          )}
                        >
                          {printer.status}
                        </span>
                      </TableCell>
                      <TableCell>{printer.remainingMaterial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!itemName || !startDate || designFiles.length === 0 || selectedPrinter === null}
          >
            진행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
