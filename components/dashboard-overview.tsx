"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pagination } from "@/components/ui/pagination"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Activity, AlertCircle, Clock, Eye, Printer } from "lucide-react"
import dynamic from "next/dynamic"

// FullCalendar를 클라이언트 사이드에서만 로드
const DashboardCalendar = dynamic(() => import("@/components/dashboard-calendar"), {
  ssr: false,
})

// 가상 데이터
const projectsData = [
  {
    id: "1",
    client: "ABC 기업",
    name: "웹사이트 리뉴얼 프로젝트",
    assignee: "김철수",
    status: "진행중",
    progress: 75,
    startDate: "2025-05-01",
    endDate: "2025-05-15",
  },
  {
    id: "2",
    client: "XYZ 회사",
    name: "모바일 앱 개발",
    assignee: "박영희",
    status: "진행중",
    progress: 40,
    startDate: "2025-05-08",
    endDate: "2025-05-30",
  },
  {
    id: "3",
    client: "123 기관",
    name: "3D 프린팅 시제품 제작",
    assignee: "이지훈",
    status: "완료",
    progress: 100,
    startDate: "2025-05-02",
    endDate: "2025-05-03",
  },
  {
    id: "4",
    client: "DEF 기업",
    name: "신규 장비 도입",
    assignee: "최민지",
    status: "진행중",
    progress: 20,
    startDate: "2025-05-12",
    endDate: "2025-05-25",
  },
  {
    id: "5",
    client: "GHI 회사",
    name: "제품 디자인 개선",
    assignee: "정수민",
    status: "진행중",
    progress: 60,
    startDate: "2025-05-05",
    endDate: "2025-05-20",
  },
  {
    id: "6",
    client: "JKL 기업",
    name: "마케팅 자료 제작",
    assignee: "김영수",
    status: "완료",
    progress: 100,
    startDate: "2025-05-01",
    endDate: "2025-05-10",
  },
]

const printersData = [
  {
    id: "1",
    name: "프린터 A",
    model: "Ultimaker S5",
    usage: "250cc",
    waitingJobs: 3,
    remainingMaterial: "75%",
    status: "진행중",
  },
  {
    id: "2",
    name: "프린터 B",
    model: "Prusa i3 MK3S+",
    usage: "120cc",
    waitingJobs: 1,
    remainingMaterial: "45%",
    status: "대기중",
  },
  {
    id: "3",
    name: "프린터 C",
    model: "Formlabs Form 3",
    usage: "180cc",
    waitingJobs: 0,
    remainingMaterial: "90%",
    status: "대기중",
  },
  {
    id: "4",
    name: "프린터 D",
    model: "Creality Ender 3",
    usage: "300cc",
    waitingJobs: 2,
    remainingMaterial: "30%",
    status: "진행중",
  },
  {
    id: "5",
    name: "프린터 E",
    model: "Anycubic Photon",
    usage: "220cc",
    waitingJobs: 1,
    remainingMaterial: "60%",
    status: "대기중",
  },
  {
    id: "6",
    name: "프린터 F",
    model: "Zortrax M200",
    usage: "150cc",
    waitingJobs: 0,
    remainingMaterial: "85%",
    status: "진행중",
  },
]

const usageData = [
  { name: "프린터 A", usage: 250 },
  { name: "프린터 B", usage: 120 },
  { name: "프린터 C", usage: 180 },
  { name: "프린터 D", usage: 300 },
  { name: "프린터 E", usage: 220 },
  { name: "프린터 F", usage: 150 },
]

// 캘린더 이벤트 데이터
const calendarEvents = [
  {
    id: "1",
    title: "웹사이트 리뉴얼 프로젝트",
    start: "2025-05-01",
    end: "2025-05-15",
    color: "#4f46e5",
  },
  {
    id: "2",
    title: "모바일 앱 개발",
    start: "2025-05-08",
    end: "2025-05-30",
    color: "#0ea5e9",
  },
  {
    id: "3",
    title: "3D 프린팅 시제품 제작",
    start: "2025-05-02",
    end: "2025-05-03",
    color: "#10b981",
  },
  {
    id: "4",
    title: "신규 장비 도입",
    start: "2025-05-12",
    end: "2025-05-25",
    color: "#f59e0b",
  },
]

export function DashboardOverview() {
  const [projectFilter, setProjectFilter] = useState("전체")
  const [printerFilter, setPrinterFilter] = useState("전체")
  const [projectPage, setProjectPage] = useState(1)
  const [printerPage, setPrinterPage] = useState(1)
  const itemsPerPage = 3

  // 프로젝트 필터링
  const filteredProjects = projectsData.filter((project) => {
    if (projectFilter === "전체") return true
    return project.status === projectFilter
  })

  // 프린터 필터링
  const filteredPrinters = printersData.filter((printer) => {
    if (printerFilter === "전체") return true
    return printer.status === printerFilter
  })

  // 페이지네이션
  const projectStartIndex = (projectPage - 1) * itemsPerPage
  const projectEndIndex = projectStartIndex + itemsPerPage
  const paginatedProjects = filteredProjects.slice(projectStartIndex, projectEndIndex)
  const projectTotalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  const printerStartIndex = (printerPage - 1) * itemsPerPage
  const printerEndIndex = printerStartIndex + itemsPerPage
  const paginatedPrinters = filteredPrinters.slice(printerStartIndex, printerEndIndex)
  const printerTotalPages = Math.ceil(filteredPrinters.length / itemsPerPage)

  // 통계 계산
  const activeProjects = projectsData.filter((p) => p.status === "진행중").length
  const activePrinters = printersData.filter((p) => p.status === "진행중").length
  const waitingPrinters = printersData.filter((p) => p.status === "대기중").length
  const pendingApprovals = 5 // 가상 데이터

  return (
    <div className="space-y-4">
      {/* 상단 카드 영역 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중인 프로젝트</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              전체 {projectsData.length}개 중 {activeProjects}개 진행중
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">구동 중인 3D 프린트</CardTitle>
            <Printer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrinters}</div>
            <p className="text-xs text-muted-foreground">
              전체 {printersData.length}대 중 {activePrinters}대 구동중
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 중인 프린트</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingPrinters}</div>
            <p className="text-xs text-muted-foreground">
              전체 {printersData.length}대 중 {waitingPrinters}대 대기중
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">승인 요청 서류</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">승인 대기 중인 서류</p>
          </CardContent>
        </Card>
      </div>

      {/* 중간 영역 - 프로젝트 현황 & 3D 프린트 현황 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* 프로젝트 현황 */}
        <Card className="col-span-1">
          <CardHeader className="space-y-0 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>프로젝트 현황</CardTitle>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="완료">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>현재 진행 중인 프로젝트 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">번호</TableHead>
                    <TableHead>발주처</TableHead>
                    <TableHead>프로젝트명</TableHead>
                    <TableHead>작업자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>진행률</TableHead>
                    <TableHead>시작일</TableHead>
                    <TableHead>종료일</TableHead>
                    <TableHead className="text-right">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.assignee}</TableCell>
                      <TableCell>
                        <Badge
                          variant={project.status === "완료" ? "default" : "secondary"}
                          className={project.status === "완료" ? "bg-green-500" : ""}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-2 w-[60px]" />
                          <span className="text-xs">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">상세 보기</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t px-4 py-2">
                <div className="text-sm text-muted-foreground">
                  {filteredProjects.length > 0
                    ? `${projectStartIndex + 1}-${Math.min(projectEndIndex, filteredProjects.length)} of ${filteredProjects.length} 프로젝트`
                    : "프로젝트 없음"}
                </div>
                <Pagination currentPage={projectPage} totalPages={projectTotalPages} onPageChange={setProjectPage} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D 프린트 현황 */}
        <Card className="col-span-1">
          <CardHeader className="space-y-0 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>3D 프린트 현황</CardTitle>
              <Select value={printerFilter} onValueChange={setPrinterFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="대기중">대기중</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>3D 프린터 상태 및 작업 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">번호</TableHead>
                    <TableHead>프린터명</TableHead>
                    <TableHead>모델명</TableHead>
                    <TableHead>사용량</TableHead>
                    <TableHead>작업 대기수</TableHead>
                    <TableHead>잔여 소재량</TableHead>
                    <TableHead className="text-right">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPrinters.map((printer) => (
                    <TableRow key={printer.id}>
                      <TableCell>{printer.id}</TableCell>
                      <TableCell className="font-medium">{printer.name}</TableCell>
                      <TableCell>{printer.model}</TableCell>
                      <TableCell>{printer.usage}</TableCell>
                      <TableCell>{printer.waitingJobs}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={Number.parseInt(printer.remainingMaterial)} className="h-2 w-[60px]" />
                          <span className="text-xs">{printer.remainingMaterial}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/device-management/${printer.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">상세 보기</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t px-4 py-2">
                <div className="text-sm text-muted-foreground">
                  {filteredPrinters.length > 0
                    ? `${printerStartIndex + 1}-${Math.min(printerEndIndex, filteredPrinters.length)} of ${filteredPrinters.length} 프린터`
                    : "프린터 없음"}
                </div>
                <Pagination currentPage={printerPage} totalPages={printerTotalPages} onPageChange={setPrinterPage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 영역 - 캘린더 & 통계 그래프 */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        {/* 캘린더 */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>일정</CardTitle>
            <CardDescription>이번 달 주요 일정</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCalendar events={calendarEvents} />
          </CardContent>
        </Card>

        {/* 통계 그래프 */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>장치별 사용량</CardTitle>
            <CardDescription>3D 프린터 사용량 통계</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usageData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" name="사용량 (cc)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
