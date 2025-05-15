"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

// 가상 프로젝트 데이터
const projects = Array.from({ length: 120 }).map((_, i) => ({
  id: `PRJ-${1000 + i}`,
  name: `프로젝트 ${i + 1}`,
}))

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    name: string
    type: "incoming" | "outgoing"
    projectId: string
    quantity: number
  }
}

export function InventoryModal({ isOpen, onClose, initialData }: InventoryModalProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [type, setType] = useState<"incoming" | "outgoing">(initialData?.type || "incoming")
  const [projectId, setProjectId] = useState(initialData?.projectId || "")
  const [quantity, setQuantity] = useState(initialData?.quantity?.toString() || "")
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 검색어에 따른 프로젝트 필터링
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 데이터 처리 로직 추가
    console.log({ name, type, projectId, quantity: Number.parseInt(quantity) })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>재고 관리</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                품명
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">유형</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "incoming" | "outgoing")}
                className="col-span-3 flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incoming" id="incoming" />
                  <Label htmlFor="incoming">입고</Label>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <RadioGroupItem value="outgoing" id="outgoing" />
                  <Label htmlFor="outgoing">출고</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">프로젝트 명</Label>
              <div className="col-span-3">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {projectId ? projects.find((project) => project.id === projectId)?.name : "프로젝트 선택"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="프로젝트 검색..." value={searchTerm} onValueChange={setSearchTerm} />
                      <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandGroup>
                          {filteredProjects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={project.id}
                              onSelect={(currentValue) => {
                                setProjectId(currentValue === projectId ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", projectId === project.id ? "opacity-100" : "opacity-0")}
                              />
                              {project.name} ({project.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                수량
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                min="1"
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
