"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Edit, MoreHorizontal, Trash } from "lucide-react"
import { Pagination } from "@/components/ui/pagination"
import Link from "next/link"
import type { Project, ProjectStatus, ProjectType } from "@/types/project"
import { format } from "date-fns"

// 샘플 프로젝트 데이터
const sampleProjects: Project[] = [
  {
    id: 1,
    client: "삼성전자",
    title: "ERP 시스템 구축",
    type: "일반",
    worker: "김철수",
    registrar: "이영희",
    startDate: new Date(2025, 0, 15),
    endDate: new Date(2025, 3, 30),
    status: "진행중 - 설계",
  },
  {
    id: 2,
    client: "LG전자",
    title: "모바일 앱 개발",
    type: "보안",
    worker: "박지민",
    registrar: "김민수",
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 4, 15),
    status: "대기",
  },
  {
    id: 3,
    client: "현대자동차",
    title: "웹사이트 리뉴얼",
    type: "일반",
    worker: "정수진",
    registrar: "이영희",
    startDate: new Date(2024, 11, 1),
    endDate: new Date(2025, 1, 28),
    status: "완료",
  },
  {
    id: 4,
    client: "SK텔레콤",
    title: "데이터 분석 시스템",
    type: "보안",
    worker: "한지훈",
    registrar: "김철수",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 5, 20),
    status: "진행중 - 제작",
  },
  {
    id: 5,
    client: "롯데그룹",
    title: "온라인 쇼핑몰 개발",
    type: "일반",
    worker: "이민지",
    registrar: "박지민",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 6, 30),
    status: "진행중 - 최종 검토",
  },
  // 추가 데이터
  {
    id: 6,
    client: "네이버",
    title: "검색 엔진 최적화",
    type: "보안",
    worker: "최영수",
    registrar: "김철수",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 7, 30),
    status: "대기",
  },
  {
    id: 7,
    client: "카카오",
    title: "메신저 앱 업데이트",
    type: "일반",
    worker: "정민호",
    registrar: "이영희",
    startDate: new Date(2025, 3, 15),
    endDate: new Date(2025, 6, 15),
    status: "진행중 - 설계",
  },
  {
    id: 8,
    client: "쿠팡",
    title: "물류 시스템 개선",
    type: "보안",
    worker: "김지연",
    registrar: "박지민",
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 8, 30),
    status: "대기",
  },
  {
    id: 9,
    client: "배달의민족",
    title: "주문 시스템 개발",
    type: "일반",
    worker: "이승우",
    registrar: "김민수",
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 5, 15),
    status: "완료",
  },
  {
    id: 10,
    client: "토스",
    title: "결제 시스템 보안 강화",
    type: "보안",
    worker: "박서연",
    registrar: "이영희",
    startDate: new Date(2025, 4, 10),
    endDate: new Date(2025, 7, 10),
    status: "진행중 - 제작",
  },
]

type SortField = "id" | "client" | "type" | "startDate" | "endDate" | "status"
type SortDirection = "asc" | "desc"

export function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [sortField, setSortField] = useState<SortField>("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // 상태에 따른 정렬 순서
  const statusOrder = {
    대기: 1,
    "진행중 - 설계": 2,
    "진행중 - 제작": 3,
    "진행중 - 최종 검토": 4,
    완료: 5,
  }

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1

      switch (sortField) {
        case "id":
          return (a.id - b.id) * direction
        case "client":
          return a.client.localeCompare(b.client) * direction
        case "type":
          return a.type.localeCompare(b.type) * direction
        case "startDate":
          return (a.startDate.getTime() - b.startDate.getTime()) * direction
        case "endDate":
          return (a.endDate.getTime() - b.endDate.getTime()) * direction
        case "status":
          return (statusOrder[a.status] - statusOrder[b.status]) * direction
        default:
          return 0
      }
    })
  }, [projects, sortField, sortDirection])

  // 현재 페이지에 표시할 프로젝트 목록 계산
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedProjects.slice(indexOfFirstItem, indexOfLastItem)

  // 총 페이지 수 계산
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage)

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case "대기":
        return "warning"
      case "진행중 - 설계":
      case "진행중 - 제작":
      case "진행중 - 최종 검토":
        return "default"
      case "완료":
        return "success"
      default:
        return "outline"
    }
  }

  const getProjectTypeBadgeVariant = (type: ProjectType) => {
    switch (type) {
      case "보안":
        return "destructive"
      case "일반":
        return "secondary"
      default:
        return "outline"
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort("id")}>
              <div className="flex items-center">
                번호
                <SortIcon field="id" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("client")}>
              <div className="flex items-center">
                발주처
                <SortIcon field="client" />
              </div>
            </TableHead>
            <TableHead className="max-w-[300px]">제목</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
              <div className="flex items-center">
                프로젝트 구분
                <SortIcon field="type" />
              </div>
            </TableHead>
            <TableHead>작업자</TableHead>
            <TableHead>등록자</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
              <div className="flex items-center">
                시작일
                <SortIcon field="startDate" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("endDate")}>
              <div className="flex items-center">
                종료일
                <SortIcon field="endDate" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                상태
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                프로젝트가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">{project.title}</TableCell>
                <TableCell>
                  <Badge variant={getProjectTypeBadgeVariant(project.type)}>{project.type}</Badge>
                </TableCell>
                <TableCell>{project.worker}</TableCell>
                <TableCell>{project.registrar}</TableCell>
                <TableCell>{format(project.startDate, "yyyy.MM.dd")}</TableCell>
                <TableCell>{format(project.endDate, "yyyy.MM.dd")}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>작업</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/projects/${project.id}`} className="flex w-full items-center">
                          상세 보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/projects/${project.id}/edit`} className="flex w-full items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 페이지네이션 추가 */}
      <div className="flex items-center justify-between border-t px-4 py-4">
        <div className="text-sm text-muted-foreground">
          {sortedProjects.length > 0
            ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedProjects.length)} of ${sortedProjects.length} 프로젝트`
            : "프로젝트 없음"}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}
