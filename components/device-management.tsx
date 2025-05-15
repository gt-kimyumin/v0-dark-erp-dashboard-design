"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DeviceStatusTable } from "@/components/device-status-table"
import { DeviceUsageGraph } from "@/components/device-usage-graph"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DeviceAddForm } from "@/components/device-add-form"

export function DeviceManagement() {
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [devices, setDevices] = useState<any[]>([
    {
      id: "DEV001",
      name: "Markforged X7",
      image: "/placeholder.svg?height=50&width=50",
      status: "진행중",
      usage: 1250,
      waitingJobs: 3,
      remainingMaterial: 450,
    },
    {
      id: "DEV002",
      name: "Ultimaker S5",
      image: "/placeholder.svg?height=50&width=50",
      status: "대기",
      usage: 890,
      waitingJobs: 0,
      remainingMaterial: 600,
    },
    {
      id: "DEV003",
      name: "Formlabs Form 3",
      image: "/placeholder.svg?height=50&width=50",
      status: "종료",
      usage: 2100,
      waitingJobs: 0,
      remainingMaterial: 120,
    },
    {
      id: "DEV004",
      name: "Prusa i3 MK3S+",
      image: "/placeholder.svg?height=50&width=50",
      status: "대기",
      usage: 450,
      waitingJobs: 1,
      remainingMaterial: 800,
    },
  ])

  const handleAddDevice = (newDevice: any) => {
    setDevices([...devices, newDevice])
    setIsAddDeviceOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* 상단: 장치 추가 버튼 */}
      <div className="flex justify-end">
        <Button onClick={() => setIsAddDeviceOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          장치 추가
        </Button>
      </div>

      {/* 중간: 그래프 섹션 */}
      <div className="rounded-md border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">장치 사용량 분석</h2>
        <DeviceUsageGraph devices={devices} />
      </div>

      {/* 하단: 장치 현황 테이블 */}
      <div className="rounded-md border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">장치 현황 조회</h2>
        <DeviceStatusTable devices={devices} setDevices={setDevices} />
      </div>

      {/* 장치 추가 다이얼로그 */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>새 장치 추가</DialogTitle>
            <DialogDescription>새로운 장치의 정보를 입력하세요.</DialogDescription>
          </DialogHeader>
          <DeviceAddForm onSuccess={handleAddDevice} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
