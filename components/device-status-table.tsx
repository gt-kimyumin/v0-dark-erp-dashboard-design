"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash, Search, Info, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Device {
  id: string
  name: string
  image: string
  status: "대기" | "진행중" | "종료"
  usage: number
  waitingJobs: number
  remainingMaterial: number
}

interface DeviceStatusTableProps {
  devices: Device[]
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>
}

export function DeviceStatusTable({ devices, setDevices }: DeviceStatusTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 현재 페이지에 표시할 장치 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDevices.slice(indexOfFirstItem, indexOfLastItem)

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleDelete = (device: Device) => {
    setDeviceToDelete(device)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deviceToDelete) {
      setDevices(devices.filter((d) => d.id !== deviceToDelete.id))
      setIsDeleteDialogOpen(false)
      setDeviceToDelete(null)
    }
  }

  const handleDetailView = (device: Device) => {
    setSelectedDevice(device)
    setIsDetailOpen(true)
  }

  const getStatusBadge = (status: Device["status"]) => {
    switch (status) {
      case "대기":
        return (
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            대기
          </Badge>
        )
      case "진행중":
        return (
          <Badge variant="default" className="flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            진행중
          </Badge>
        )
      case "종료":
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            종료
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="장치 이름 또는 ID로 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">이미지</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">사용량</TableHead>
              <TableHead className="text-right">작업 대기 수</TableHead>
              <TableHead className="text-right">잔여 소재량</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  등록된 장치가 없거나 검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <img
                      src={device.image || "/placeholder.svg"}
                      alt={device.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell className="text-right">{device.usage.toLocaleString()} cc</TableCell>
                  <TableCell className="text-right">{device.waitingJobs}</TableCell>
                  <TableCell className="text-right">{device.remainingMaterial.toLocaleString()} cc</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDetailView(device)} className="h-8 w-8">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">상세 정보</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(device)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">삭제</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 페이지네이션 추가 */}
        <div className="flex items-center justify-between border-t px-4 py-4">
          <div className="text-sm text-muted-foreground">
            {filteredDevices.length > 0
              ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredDevices.length)} of ${filteredDevices.length} 장치`
              : "장치 없음"}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      {/* 장치 상세 정보 다이얼로그 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>장치 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedDevice?.name} ({selectedDevice?.id}) 장치의 상세 정보입니다.
            </DialogDescription>
          </DialogHeader>

          {selectedDevice && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <img
                  src={selectedDevice.image || "/placeholder.svg"}
                  alt={selectedDevice.name}
                  className="h-40 w-40 rounded-md object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">장치 이름</p>
                  <p className="font-medium">{selectedDevice.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">장치 ID</p>
                  <p className="font-medium">{selectedDevice.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">상태</p>
                  <div className="pt-1">{getStatusBadge(selectedDevice.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">작업 대기 수</p>
                  <p className="font-medium">{selectedDevice.waitingJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">총 사용량</p>
                  <p className="font-medium">{selectedDevice.usage.toLocaleString()} cc</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">잔여 소재량</p>
                  <p className="font-medium">{selectedDevice.remainingMaterial.toLocaleString()} cc</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 장치 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>장치 삭제 확인</DialogTitle>
            <DialogDescription>
              정말로 {deviceToDelete?.name} ({deviceToDelete?.id}) 장치를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
