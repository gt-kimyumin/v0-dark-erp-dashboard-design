"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Device {
  id: string
  name: string
  image: string
  status: "대기" | "진행중" | "종료"
  usage: number
  waitingJobs: number
  remainingMaterial: number
}

interface DeviceUsageData {
  id: string
  name: string
  dailyUsage: {
    date: string
    usage: number
  }[]
}

interface DeviceUsageGraphProps {
  devices: Device[]
}

export function DeviceUsageGraph({ devices }: DeviceUsageGraphProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [usageData, setUsageData] = useState<DeviceUsageData[]>([])

  // 장치 데이터가 변경될 때 사용량 데이터 생성
  useEffect(() => {
    // 실제 구현에서는 API에서 데이터를 가져오겠지만, 여기서는 샘플 데이터 생성
    const generateUsageData = () => {
      return devices.map((device) => {
        // 최근 7일 데이터 생성
        const dailyUsage = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))

          // 장치별로 다른 패턴의 사용량 생성
          let baseUsage = 0
          if (device.status === "진행중") {
            baseUsage = 100 + Math.floor(Math.random() * 100)
          } else if (device.status === "대기") {
            baseUsage = 50 + Math.floor(Math.random() * 50)
          } else {
            baseUsage = 20 + Math.floor(Math.random() * 30)
          }

          return {
            date: date.toISOString().split("T")[0],
            usage: baseUsage,
          }
        })

        return {
          id: device.id,
          name: device.name,
          dailyUsage,
        }
      })
    }

    setUsageData(generateUsageData())
  }, [devices])

  // 초기 선택 장치 설정
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].id)
    }
  }, [devices, selectedDeviceId])

  // 선택된 장치의 사용량 데이터
  const selectedDeviceData = usageData.find((device) => device.id === selectedDeviceId)

  // 모든 장치의 일일 사용량 합계 계산
  const calculateTotalDailyUsage = () => {
    if (usageData.length === 0) return []

    const dates = usageData[0]?.dailyUsage.map((item) => item.date) || []

    return dates.map((date) => {
      const totalUsage = usageData.reduce((sum, device) => {
        const dayData = device.dailyUsage.find((d) => d.date === date)
        return sum + (dayData?.usage || 0)
      }, 0)

      return { date, usage: totalUsage }
    })
  }

  const totalDailyUsage = calculateTotalDailyUsage()

  // 최대 사용량 계산 (그래프 스케일링용)
  const getMaxUsage = () => {
    const selectedData = selectedDeviceId ? selectedDeviceData?.dailyUsage || [] : totalDailyUsage

    return Math.max(...selectedData.map((d) => d.usage), 100) // 최소 100으로 설정
  }

  const maxUsage = getMaxUsage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">장치별 일일 사용량</h3>
        <div className="w-[200px]">
          <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
            <SelectTrigger>
              <SelectValue placeholder="장치 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 장치</SelectItem>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <div className="flex h-full flex-col">
              <div className="flex h-[250px] items-end gap-2">
                {(selectedDeviceId === "all" ? totalDailyUsage : selectedDeviceData?.dailyUsage)?.map((day, i) => (
                  <div key={i} className="relative flex w-full flex-1 flex-col items-center overflow-hidden rounded-md">
                    <div
                      className="absolute bottom-0 w-full bg-primary transition-all duration-300"
                      style={{ height: `${(day.usage / maxUsage) * 100}%` }}
                    />
                    <span className="relative mt-2 text-xs font-medium">{day.usage}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                {(selectedDeviceId === "all" ? totalDailyUsage : selectedDeviceData?.dailyUsage)?.map((day, i) => (
                  <div key={i} className="text-center">
                    {new Date(day.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {usageData.map((device) => (
          <Card key={device.id} className={selectedDeviceId === device.id ? "border-primary" : ""}>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium">{device.name}</h4>
              <div className="text-2xl font-bold mt-1">
                {device.dailyUsage.reduce((sum, day) => sum + day.usage, 0).toLocaleString()} cc
              </div>
              <p className="text-xs text-muted-foreground">7일 총 사용량</p>
              <div className="mt-2 h-[60px]">
                <div className="flex h-[40px] items-end gap-1">
                  {device.dailyUsage.map((day, i) => (
                    <div key={i} className="relative flex w-full flex-1 items-end overflow-hidden rounded-sm">
                      <div
                        className="w-full bg-primary/60 transition-all duration-300"
                        style={{ height: `${(day.usage / Math.max(...device.dailyUsage.map((d) => d.usage))) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
