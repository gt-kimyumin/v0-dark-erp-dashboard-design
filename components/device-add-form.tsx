"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface DeviceAddFormProps {
  onSuccess?: (device: any) => void
}

export function DeviceAddForm({ onSuccess }: DeviceAddFormProps) {
  const [deviceName, setDeviceName] = useState("")
  const [deviceId, setDeviceId] = useState("")
  const [deviceImage, setDeviceImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setDeviceImage(file)

      // 이미지 미리보기 생성
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setDeviceImage(null)
    setPreviewUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!deviceName || !deviceId) {
      alert("장치 이름과 ID를 입력해주세요.")
      return
    }

    setIsSubmitting(true)

    try {
      // 실제 구현에서는 API 호출로 대체
      const newDevice = {
        id: deviceId,
        name: deviceName,
        image: previewUrl || "/placeholder.svg?height=50&width=50",
        status: "대기",
        usage: 0,
        waitingJobs: 0,
        remainingMaterial: 1000,
      }

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(newDevice)
      }

      // 폼 초기화
      setDeviceName("")
      setDeviceId("")
      setDeviceImage(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("장치 추가 중 오류 발생:", error)
      alert("장치 추가 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="device-name">장치 이름</Label>
          <Input
            id="device-name"
            placeholder="장치 이름 입력 (최대 50자)"
            maxLength={50}
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="device-id">장치 ID</Label>
          <Input
            id="device-id"
            placeholder="장치 ID 입력 (최대 50자)"
            maxLength={50}
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>장치 이미지</Label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Input id="device-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById("device-image")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              이미지 선택
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">권장 이미지 크기: 300x300 픽셀, 최대 파일 크기: 2MB</p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="flex h-[150px] items-center justify-center p-2">
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="장치 이미지 미리보기"
                    className="h-full w-full object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 top-0 h-6 w-6"
                    onClick={clearImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-16 w-16 mb-2" />
                  <p className="text-sm">이미지 미리보기</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDeviceName("")
            setDeviceId("")
            setDeviceImage(null)
            setPreviewUrl(null)
          }}
        >
          초기화
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "처리 중..." : "장치 추가"}
        </Button>
      </div>
    </form>
  )
}
