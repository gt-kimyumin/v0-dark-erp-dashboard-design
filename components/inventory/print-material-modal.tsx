"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PrintMaterialModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    type: "incoming" | "outgoing" | "disposal"
    materialName: string
    quantityG: number
    quantityCC: number
  }
}

export function PrintMaterialModal({ isOpen, onClose, initialData }: PrintMaterialModalProps) {
  const [type, setType] = useState<"incoming" | "outgoing" | "disposal">(initialData?.type || "incoming")
  const [materialName, setMaterialName] = useState(initialData?.materialName || "")
  const [quantityG, setQuantityG] = useState(initialData?.quantityG?.toString() || "")
  const [quantityCC, setQuantityCC] = useState(initialData?.quantityCC?.toString() || "")

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 데이터 처리 로직 추가
    console.log({ type, materialName, quantityG: Number.parseInt(quantityG), quantityCC: Number.parseInt(quantityCC) })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>3D 프린트 소재 관리</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">유형</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "incoming" | "outgoing" | "disposal")}
                className="col-span-3 flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incoming" id="incoming" />
                  <Label htmlFor="incoming">입고</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outgoing" id="outgoing" />
                  <Label htmlFor="outgoing">출고</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="disposal" id="disposal" />
                  <Label htmlFor="disposal">폐기</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialName" className="text-right">
                소재명
              </Label>
              <Input
                id="materialName"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantityG" className="text-right">
                양 - g
              </Label>
              <Input
                id="quantityG"
                type="number"
                value={quantityG}
                onChange={(e) => setQuantityG(e.target.value)}
                className="col-span-3"
                min="0"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantityCC" className="text-right">
                양 - cc
              </Label>
              <Input
                id="quantityCC"
                type="number"
                value={quantityCC}
                onChange={(e) => setQuantityCC(e.target.value)}
                className="col-span-3"
                min="0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
