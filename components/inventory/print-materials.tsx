"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PrintMaterialModal } from "@/components/inventory/print-material-modal"
import { Pagination } from "@/components/ui/pagination"
import { Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// 가상 데이터
const printMaterialsData = Array.from({ length: 30 }).map((_, i) => ({
  id: `MAT-${1000 + i}`,
  name: `3D 프린트 소재 ${i + 1}`,
  stock: Math.floor(Math.random() * 100),
  stockCC: Math.floor(Math.random() * 1000),
  color: `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`,
}))

// 차트 데이터 생성
const generateChartData = (materials: typeof printMaterialsData, filter: string) => {
  if (filter === "all") {
    return materials.map((material) => ({
      name: material.name,
      cc: material.stockCC,
    }))
  } else {
    return materials
      .filter((material) => material.name.includes(filter))
      .map((material) => ({
        name: material.name,
        cc: material.stockCC,
      }))
  }
}

export function PrintMaterials() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [searchCategory, setSearchCategory] = useState<string[]>(["all"])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [chartFilter, setChartFilter] = useState("all")
  const itemsPerPage = 10

  // 입고/출고 횟수 (가상 데이터)
  const totalIncoming = 128
  const totalOutgoing = 95

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
  const filteredData = printMaterialsData.filter((item) => {
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

  // 차트 데이터
  const chartData = generateChartData(printMaterialsData, chartFilter)

  return (
    <div className="space-y-6">
      {/* 보유량 그래프 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">3D 프린트 소재 보유량</CardTitle>
          <Select value={chartFilter} onValueChange={setChartFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="필터 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {printMaterialsData.map((material) => (
                <SelectItem key={material.id} value={material.name}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "수량", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cc" name="용량 (cc)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                <SelectItem value="name">소재명</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>분류</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-print"
                  checked={searchCategory.includes("all")}
                  onCheckedChange={() => handleCheckboxChange("all")}
                />
                <label
                  htmlFor="all-print"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  전체
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incoming-print"
                  checked={searchCategory.includes("incoming")}
                  onCheckedChange={() => handleCheckboxChange("incoming")}
                />
                <label
                  htmlFor="incoming-print"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  입고
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="outgoing-print"
                  checked={searchCategory.includes("outgoing")}
                  onCheckedChange={() => handleCheckboxChange("outgoing")}
                />
                <label
                  htmlFor="outgoing-print"
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
              <TableHead>소재명</TableHead>
              <TableHead>재고량 (g)</TableHead>
              <TableHead>재고량 (cc)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.stock} g</TableCell>
                <TableCell>{item.stockCC} cc</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/print-materials/${item.id}`}>
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
      <PrintMaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
