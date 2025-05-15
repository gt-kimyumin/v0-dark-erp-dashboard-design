"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { InventoryModal } from "@/components/inventory/inventory-modal"
import { DeleteConfirmationModal } from "@/components/inventory/delete-confirmation-modal"
import { ArrowUpDown, Trash2 } from "lucide-react"

// 가상 데이터 생성
const generateInventoryHistory = (id: string) => {
  return Array.from({ length: 30 }).map((_, i) => {
    const isIncoming = Math.random() > 0.5
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    return {
      id: `TRX-${1000 + i}`,
      projectName: `프로젝트 ${Math.floor(Math.random() * 100) + 1}`,
      incomingDate: isIncoming ? date.toISOString().split("T")[0] : "",
      outgoingDate: !isIncoming ? date.toISOString().split("T")[0] : "",
      incomingPerson: isIncoming ? `사용자 ${Math.floor(Math.random() * 10) + 1}` : "",
      outgoingPerson: !isIncoming ? `사용자 ${Math.floor(Math.random() * 10) + 1}` : "",
      incomingQuantity: isIncoming ? Math.floor(Math.random() * 20) + 1 : 0,
      outgoingQuantity: !isIncoming ? Math.floor(Math.random() * 10) + 1 : 0,
      stock: Math.floor(Math.random() * 100),
    }
  })
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const itemsPerPage = 10

  // 가상 데이터
  const inventoryHistory = generateInventoryHistory(id)
  const productName = `품목 ${Number.parseInt(id.split("-")[1]) - 1000}`
  const currentStock = inventoryHistory[0]?.stock || 0

  // 정렬 핸들러
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // 정렬된 데이터
  const sortedData = [...inventoryHistory]
  if (sortConfig) {
    sortedData.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  // 페이지네이션
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // 삭제 핸들러
  const handleDelete = (itemId: string) => {
    setSelectedItemId(itemId)
    setIsDeleteModalOpen(true)
  }

  // 삭제 확인 핸들러
  const confirmDelete = () => {
    console.log(`Deleting item: ${selectedItemId}`)
    setIsDeleteModalOpen(false)
    setSelectedItemId(null)
    // 여기에 실제 삭제 로직 추가
  }

  return (
    <DashboardShell>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("id")}>
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("projectName")}>
                  프로젝트명
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("incomingDate")}>
                  입고 날짜
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("outgoingDate")}>
                  출고 날짜
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("incomingPerson")}>
                  입고자
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("outgoingPerson")}>
                  출고자
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("incomingQuantity")}>
                  입고량
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("outgoingQuantity")}>
                  출고량
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("stock")}>
                  재고량
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.projectName}</TableCell>
                <TableCell>{item.incomingDate}</TableCell>
                <TableCell>{item.outgoingDate}</TableCell>
                <TableCell>{item.incomingPerson}</TableCell>
                <TableCell>{item.outgoingPerson}</TableCell>
                <TableCell>{item.incomingQuantity > 0 ? item.incomingQuantity : "-"}</TableCell>
                <TableCell>{item.outgoingQuantity > 0 ? item.outgoingQuantity : "-"}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">삭제</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-between border-t px-4 py-4">
          <div className="text-sm text-muted-foreground">
            {sortedData.length > 0
              ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedData.length)} of ${sortedData.length} items`
              : "No items"}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* 재고 관리 모달 */}
      <InventoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </DashboardShell>
  )
}
