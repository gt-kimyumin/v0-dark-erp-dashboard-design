"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash, Edit, Search, Check, X, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Admin {
  id: string
  name: string
  email: string
  role: "관리자" | "슈퍼관리자" | "일반 사용자"
  department: string
  status: "활성" | "비활성"
  lastLogin: string
  avatar?: string
}

export function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [formData, setFormData] = useState<Partial<Admin>>({
    name: "",
    email: "",
    role: "일반 사용자",
    department: "",
    status: "활성",
  })

  // 샘플 관리자 데이터
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: "ADM001",
      name: "김관리",
      email: "admin1@example.com",
      role: "슈퍼관리자",
      department: "IT 부서",
      status: "활성",
      lastLogin: "2025-05-10 14:30",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM002",
      name: "이사용",
      email: "admin2@example.com",
      role: "관리자",
      department: "인사 부서",
      status: "활성",
      lastLogin: "2025-05-09 11:15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM003",
      name: "박일반",
      email: "user1@example.com",
      role: "일반 사용자",
      department: "영업 부서",
      status: "활성",
      lastLogin: "2025-05-08 09:45",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM004",
      name: "최비활",
      email: "inactive@example.com",
      role: "일반 사용자",
      department: "마케팅 부서",
      status: "비활성",
      lastLogin: "2025-04-30 16:20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // 추가 데이터
    {
      id: "ADM005",
      name: "정보안",
      email: "security@example.com",
      role: "관리자",
      department: "보안 부서",
      status: "활성",
      lastLogin: "2025-05-11 10:45",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM006",
      name: "한개발",
      email: "developer@example.com",
      role: "일반 사용자",
      department: "개발 부서",
      status: "활성",
      lastLogin: "2025-05-10 09:30",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM007",
      name: "송디자인",
      email: "designer@example.com",
      role: "일반 사용자",
      department: "디자인 부서",
      status: "활성",
      lastLogin: "2025-05-09 14:20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "ADM008",
      name: "강마케팅",
      email: "marketing@example.com",
      role: "일반 사용자",
      department: "마케팅 부서",
      status: "비활성",
      lastLogin: "2025-05-01 11:10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 현재 페이지에 표시할 관리자 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem)

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleAddAdmin = () => {
    if (!formData.name || !formData.email || !formData.department) {
      alert("이름, 이메일, 부서는 필수 입력 항목입니다.")
      return
    }

    const newAdmin: Admin = {
      id: `ADM${String(admins.length + 1).padStart(3, "0")}`,
      name: formData.name || "",
      email: formData.email || "",
      role: formData.role as "관리자" | "슈퍼관리자" | "일반 사용자",
      department: formData.department || "",
      status: formData.status as "활성" | "비활성",
      lastLogin: "아직 로그인하지 않음",
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setAdmins([...admins, newAdmin])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditAdmin = () => {
    if (!selectedAdmin || !formData.name || !formData.email || !formData.department) {
      alert("이름, 이메일, 부서는 필수 입력 항목입니다.")
      return
    }

    const updatedAdmins = admins.map((admin) => {
      if (admin.id === selectedAdmin.id) {
        return {
          ...admin,
          name: formData.name || admin.name,
          email: formData.email || admin.email,
          role: (formData.role as "관리자" | "슈퍼관리자" | "일반 사용자") || admin.role,
          department: formData.department || admin.department,
          status: (formData.status as "활성" | "비활성") || admin.status,
        }
      }
      return admin
    })

    setAdmins(updatedAdmins)
    setIsEditDialogOpen(false)
    setSelectedAdmin(null)
    resetForm()
  }

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return

    const updatedAdmins = admins.filter((admin) => admin.id !== selectedAdmin.id)
    setAdmins(updatedAdmins)
    setIsDeleteDialogOpen(false)
    setSelectedAdmin(null)
  }

  const openEditDialog = (admin: Admin) => {
    setSelectedAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      department: admin.department,
      status: admin.status,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "일반 사용자",
      department: "",
      status: "활성",
    })
  }

  const getStatusBadge = (status: Admin["status"]) => {
    return status === "활성" ? (
      <Badge variant="default" className="flex items-center">
        <Check className="mr-1 h-3 w-3" />
        활성
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center">
        <X className="mr-1 h-3 w-3" />
        비활성
      </Badge>
    )
  }

  const getRoleBadge = (role: Admin["role"]) => {
    switch (role) {
      case "슈퍼관리자":
        return <Badge variant="destructive">슈퍼관리자</Badge>
      case "관리자":
        return <Badge variant="default">관리자</Badge>
      case "일반 사용자":
        return <Badge variant="outline">일반 사용자</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 상단: 통��� 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 관리자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
            <p className="text-xs text-muted-foreground">
              활성 {admins.filter((admin) => admin.status === "활성").length} / 비활성{" "}
              {admins.filter((admin) => admin.status === "비활성").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">슈퍼관리자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter((admin) => admin.role === "슈퍼관리자").length}</div>
            <p className="text-xs text-muted-foreground">전체 권한 보유</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 로그인</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">
              {admins.length > 0
                ? admins.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())[0].name
                : "없음"}
            </div>
            <p className="text-xs text-muted-foreground">
              {admins.length > 0
                ? admins.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())[0].lastLogin
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 추가 버튼 */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="이름, 이메일 또는 부서로 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          관리자 추가
        </Button>
      </div>

      {/* 관리자 목록 테이블 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">프로필</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>부서</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>마지막 로그인</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  등록된 관리자가 없거나 검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                      <AvatarFallback>{admin.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell>{admin.department}</TableCell>
                  <TableCell>{getStatusBadge(admin.status)}</TableCell>
                  <TableCell>{admin.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(admin)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">수정</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(admin)}
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
            {filteredAdmins.length > 0
              ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredAdmins.length)} of ${filteredAdmins.length} 관리자`
              : "관리자 없음"}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      {/* 관리자 추가 다이얼로그 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>관리자 추가</DialogTitle>
            <DialogDescription>새로운 관리자 정보를 입력하세요.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="이름 입력"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="이메일 입력"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="슈퍼관리자">슈퍼관리자</SelectItem>
                    <SelectItem value="관리자">관리자</SelectItem>
                    <SelectItem value="일반 사용자">일반 사용자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="부서 입력"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="활성">활성</SelectItem>
                  <SelectItem value="비활성">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddAdmin}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 관리자 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>관리자 정보 수정</DialogTitle>
            <DialogDescription>관리자 정보를 수정하세요.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">이름</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="이름 입력"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">이메일</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="이메일 입력"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">역할</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="슈퍼관리자">슈퍼관리자</SelectItem>
                    <SelectItem value="관리자">관리자</SelectItem>
                    <SelectItem value="일반 사용자">일반 사용자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">부서</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="부서 입력"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="활성">활성</SelectItem>
                  <SelectItem value="비활성">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditAdmin}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 관리자 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>관리자 삭제 확인</DialogTitle>
            <DialogDescription>
              정말로 {selectedAdmin?.name} ({selectedAdmin?.email}) 관리자를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
