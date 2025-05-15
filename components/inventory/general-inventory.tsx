"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryModal } from "@/components/inventory/inventory-modal"
import { Pagination } from "@/components/ui/pagination"
import { Eye, Trash2 } from "lucide-react"
import Link from "next/link"

// 가상 데이터
const inventoryData = Array.from({ length: 30 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  name: `일반 재고 품목 ${i + 1}`,
  stock: Math.floor(Math.random() * 100),
}))

export function GeneralInventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [searchCategory, setSearchCategory] = useState<string[]>(["all"])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 입고/출고 횟수 (가상 데이터)
  const totalIncoming = 156
  const totalOutgoing = 112

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (value: string) => {
    if (value === "all") {
      setSearchCategory(["all"])
    } else {
      const newCategories = searchCategory.filter((cat) => cat !== "all")
      if (newCategories.includes(value)) {
        setSearchCategory(newCategories.filter((cat) => cat !== value))
      } else {
        setSearchCategory([...newCategories, value])
      }

      // 모든 카테고리가 선택되었는지 확인
      if (newCategories.length === 0) {
        setSearchCategory(["all"])
      }
    }
  }

  // 검색 필터링된 데이터
  const filteredData = inventoryData.filter((item) => {
    if (searchTerm && searchType === "name" && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

  // 페이지네이션
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="space-y-6">
      {/* 입고/출고 횟수 표시 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalIncoming}</div>
            <p className="text-sm text-muted-foreground">전체 입고 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalOutgoing}</div>
            <p className="text-sm text-muted-foreground">전체 출고 횟수</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 재고 관리 버튼 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="search">검색</Label>
            <Input
              id="search"
              placeholder="검색어 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="searchType">검색 유형</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger id="searchType">
                <SelectValue placeholder="검색 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="name">품명</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>분류</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={searchCategory.includes("all")}
                  onCheckedChange={() => handleCheckboxChange("all")}
                />
                <label
                  htmlFor="all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  전체
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incoming"
                  checked={searchCategory.includes("incoming")}
                  onCheckedChange={() => handleCheckboxChange("incoming")}
                />
                <label
                  htmlFor="incoming"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  입고
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outgoing"
                  checked={searchCategory.includes("outgoing")}
                  onCheckedChange={() => handleCheckboxChange("outgoing")}
                />
                <label
                  htmlFor="outgoing"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  출고
                </label>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>재고 관리</Button>
      </div>

      {/* 재고 리스트 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>품명</TableHead>
              <TableHead>재고량</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/${item.id}`}>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">상세 조회</span>
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">삭제</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t px-4 py-4">
          <div className="text-sm text-muted-foreground">
            {filteredData.length > 0
              ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredData.length)} of ${filteredData.length} items`
              : "No items"}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* 재고 관리 모달 */}
      <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
