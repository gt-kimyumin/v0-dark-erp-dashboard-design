"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, Trash, FileText, PrinterIcon as Printer3d, Receipt, ShoppingBag } from "lucide-react"
import type { QualityDocument, ProductionMaterial } from "@/types/project"
import { format } from "date-fns"
import { PaymentItemDialog } from "@/components/payment-item-dialog"
import { MaterialDetailDialog } from "@/components/material-detail-dialog"
import { PrintRequestDialog } from "@/components/print-request-dialog"
import { PrintStatusMonitor } from "@/components/print-status-monitor"

export function ProductionStageContent() {
  const [qualityDocs, setQualityDocs] = useState<QualityDocument[]>([
    {
      id: 1,
      category: "전자",
      name: "회로도 품의서",
      registrationDate: new Date(2025, 1, 15),
      endDate: new Date(2025, 2, 15),
      status: "진행중",
      remarks: "회로 설계 검토 필요",
    },
    {
      id: 2,
      category: "기계",
      name: "기구물 품의서",
      registrationDate: new Date(2025, 1, 10),
      endDate: new Date(2025, 2, 10),
      status: "완료",
      remarks: "",
    },
  ])

  const [productionMaterials, setProductionMaterials] = useState<ProductionMaterial[]>([
    {
      id: 1,
      type: "가공품",
      name: "알루미늄 케이스",
      registrationDate: new Date(2025, 1, 15),
      endDate: new Date(2025, 2, 15),
      status: "진행중",
      remarks: "외주 제작 중",
    },
    {
      id: 2,
      type: "구매품",
      name: "PCB 기판",
      registrationDate: new Date(2025, 1, 10),
      endDate: new Date(2025, 2, 5),
      status: "입고 완료",
      remarks: "수량: 50개",
    },
    {
      id: 3,
      type: "구매품",
      name: "전자 부품 세트",
      registrationDate: new Date(2025, 1, 12),
      endDate: new Date(2025, 2, 10),
      status: "대기",
      remarks: "해외 배송 대기 중",
    },
  ])

  const [newDocCategory, setNewDocCategory] = useState("")
  const [newDocName, setNewDocName] = useState("")
  const [newDocRemarks, setNewDocRemarks] = useState("")
  const [fileUploads, setFileUploads] = useState<{ id: number; files: File[] }[]>([{ id: 1, files: [] }])
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isMaterialDetailOpen, setIsMaterialDetailOpen] = useState(false)
  const [isPrintRequestOpen, setIsPrintRequestOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<ProductionMaterial | undefined>(undefined)

  const handleFileUpload = () => {
    if (!newDocCategory || !newDocName) return

    const newDoc: QualityDocument = {
      id: qualityDocs.length + 1,
      category: newDocCategory,
      name: newDocName,
      registrationDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1달 후
      status: "진행중",
      remarks: newDocRemarks,
    }

    setQualityDocs([...qualityDocs, newDoc])
    setNewDocCategory("")
    setNewDocName("")
    setNewDocRemarks("")
  }

  const deleteDoc = (id: number) => {
    setQualityDocs(qualityDocs.filter((doc) => doc.id !== id))
  }

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "진행중":
      case "입고 완료":
        return "success"
      case "대기":
        return "warning"
      case "완료":
        return "default"
      default:
        return "outline"
    }
  }

  const getMaterialTypeBadgeVariant = (type: "가공품" | "구매품") => {
    switch (type) {
      case "가공품":
        return "secondary"
      case "구매품":
        return "default"
      default:
        return "outline"
    }
  }

  const handleMaterialClick = (material: ProductionMaterial) => {
    setSelectedMaterial(material)
    setIsMaterialDetailOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>제작 단계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="quality-docs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quality-docs" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              품의서
            </TabsTrigger>
            <TabsTrigger value="payment-items" className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              기타 결제 항목
            </TabsTrigger>
            <TabsTrigger value="3d-print" className="flex items-center">
              <Printer3d className="mr-2 h-4 w-4" />
              3D 프린트
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              부자재 현황
            </TabsTrigger>
          </TabsList>

          {/* 품의서 탭 */}
          <TabsContent value="quality-docs" className="space-y-6">
            {/* 품의서 업로드 폼 */}
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-lg font-medium">품의서 업로드</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doc-category">구분</Label>
                  <Input
                    id="doc-category"
                    placeholder="구분 입력 (최대 10자)"
                    maxLength={10}
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-name">품목명</Label>
                  <Input
                    id="doc-name"
                    placeholder="품목명 입력 (최대 20자)"
                    maxLength={20}
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>파일 업로드</Label>
                  {fileUploads.map((upload) => (
                    <div key={upload.id} className="mb-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`file-upload-${upload.id}`} className="text-sm font-medium">
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
                          id={`file-upload-${upload.id}`}
                          type="file"
                          className="hidden"
                          multiple
                          onChange={(e) => handleFileChange(e, upload.id)}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById(`file-upload-${upload.id}`)?.click()}
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
                  <Button variant="outline" size="sm" onClick={addFileUpload} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    파일 업로드 추가
                  </Button>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="doc-remarks">비고</Label>
                  <Input
                    id="doc-remarks"
                    placeholder="비고 입력"
                    value={newDocRemarks}
                    onChange={(e) => setNewDocRemarks(e.target.value)}
                  />
                </div>
              </div>
              <Button className="mt-4" onClick={handleFileUpload}>
                <Plus className="mr-2 h-4 w-4" />
                품의서 추가
              </Button>
            </div>

            {/* 품의서 목록 테이블 */}
            <div>
              <h3 className="mb-4 text-lg font-medium">품의서 목록</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">번호</TableHead>
                      <TableHead>구분</TableHead>
                      <TableHead>품목명</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>종료일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-[80px]">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qualityDocs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          등록된 품의서가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      qualityDocs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.id}</TableCell>
                          <TableCell>{doc.category}</TableCell>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{format(doc.registrationDate, "yyyy.MM.dd")}</TableCell>
                          <TableCell>{format(doc.endDate, "yyyy.MM.dd")}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
                          </TableCell>
                          <TableCell>{doc.remarks || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => deleteDoc(doc.id)}
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
          </TabsContent>

          {/* 기타 결제 항목 탭 */}
          <TabsContent value="payment-items" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsPaymentDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                기타 결제 항목 추가
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">번호</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>구매일</TableHead>
                    <TableHead>영수증</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      등록된 결제 항목이 없습니다.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 3D 프린트 탭 */}
          <TabsContent value="3d-print" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsPrintRequestOpen(true)}>
                <Printer3d className="mr-2 h-4 w-4" />
                3D 프린트 요청
              </Button>
            </div>

            {/* 3D 프린트 현황 모니터링 */}
            <PrintStatusMonitor />
          </TabsContent>

          {/* 부자재 현황 탭 */}
          <TabsContent value="materials" className="space-y-6">
            <h3 className="text-lg font-medium">제작 부자재 현황</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">번호</TableHead>
                    <TableHead>구분</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>종료일</TableHead>
                    <TableHead>입고 상태</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        등록된 부자재가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    productionMaterials.map((material) => (
                      <TableRow
                        key={material.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleMaterialClick(material)}
                      >
                        <TableCell>{material.id}</TableCell>
                        <TableCell>
                          <Badge variant={getMaterialTypeBadgeVariant(material.type)}>{material.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-primary">{material.name}</TableCell>
                        <TableCell>{format(material.registrationDate, "yyyy.MM.dd")}</TableCell>
                        <TableCell>{format(material.endDate, "yyyy.MM.dd")}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(material.status)}>{material.status}</Badge>
                        </TableCell>
                        <TableCell>{material.remarks || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">취소</Button>
        <Button>저장</Button>
      </CardFooter>

      <PaymentItemDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen} />
      <MaterialDetailDialog
        open={isMaterialDetailOpen}
        onOpenChange={setIsMaterialDetailOpen}
        material={selectedMaterial}
      />
      <PrintRequestDialog open={isPrintRequestOpen} onOpenChange={setIsPrintRequestOpen} />
    </Card>
  )
}
