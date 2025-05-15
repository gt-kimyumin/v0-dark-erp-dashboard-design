"use client"

import type React from "react"

import { useState } from "react"
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
import { CalendarIcon, Upload, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PaymentItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentItemDialog({ open, onOpenChange }: PaymentItemDialogProps) {
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("기타")
  const [purchaseDate, setPurchaseDate] = useState<Date>()
  const [receipt, setReceipt] = useState<File | null>(null)
  const [memo, setMemo] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceipt(e.target.files[0])
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // 여기서 데이터 처리 로직 구현
    console.log({
      itemName,
      category,
      purchaseDate,
      receipt,
      memo,
      photo,
    })

    // 폼 초기화 및 다이얼로그 닫기
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setItemName("")
    setCategory("기타")
    setPurchaseDate(undefined)
    setReceipt(null)
    setMemo("")
    setPhoto(null)
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>기타 결제 항목 추가</DialogTitle>
          <DialogDescription>결제 항목의 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="category">구분</Label>
              <Input
                id="category"
                placeholder="구분 입력 (최대 20자)"
                maxLength={20}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-date">구매일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="purchase-date"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !purchaseDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? format(purchaseDate, "yyyy.MM.dd") : "구매일 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">영수증</Label>
            <div className="flex items-center space-x-2">
              <Input id="receipt" type="file" className="hidden" onChange={handleReceiptChange} />
              <Button
                variant="outline"
                onClick={() => document.getElementById("receipt")?.click()}
                className="w-full"
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" />
                영수증 파일 선택
              </Button>
            </div>
            {receipt && (
              <div className="mt-2 rounded-md border p-2">
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  {receipt.name}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">구매 관련 메모</Label>
            <Textarea
              id="memo"
              placeholder="구매 관련 메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">제품 사진</Label>
            <div className="flex items-center space-x-2">
              <Input id="photo" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              <Button
                variant="outline"
                onClick={() => document.getElementById("photo")?.click()}
                className="w-full"
                type="button"
              >
                <Upload className="mr-2 h-4 w-4" />
                제품 사진 선택
              </Button>
            </div>
            {photo && (
              <div className="mt-2 rounded-md border p-2">
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  {photo.name}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
              승인
            </Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              반려
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              취소
            </Button>
            <Button onClick={handleSubmit}>추가</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
