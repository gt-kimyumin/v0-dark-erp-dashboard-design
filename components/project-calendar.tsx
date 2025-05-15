"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ChevronsLeft, ChevronsRight, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import dynamic from "next/dynamic"

// Dynamic import for FullCalendar to avoid SSR issues
const FullCalendarComponent = dynamic(() => import("./full-calendar-component"), { ssr: false })

// 가상 프로젝트 데이터
const mockProjects = [
  {
    id: "1",
    title: "웹사이트 리뉴얼 프로젝트",
    start: "2025-05-01",
    end: "2025-05-10",
    manager: "김철수",
    progress: 75,
    backgroundColor: "#FF5A5A",
    borderColor: "#FF5A5A",
  },
  {
    id: "2",
    title: "모바일 앱 개발",
    start: "2025-05-08",
    end: "2025-05-16",
    manager: "박영희",
    progress: 40,
    backgroundColor: "#5A8CFF",
    borderColor: "#5A8CFF",
  },
  {
    id: "3",
    title: "3D 프린팅 시제품 제작",
    start: "2025-05-02",
    end: "2025-05-03",
    manager: "이지훈",
    progress: 100,
    backgroundColor: "#5AFF8C",
    borderColor: "#5AFF8C",
  },
  {
    id: "4",
    title: "신규 장비 도입",
    start: "2025-05-12",
    end: "2025-05-12",
    manager: "최민지",
    progress: 20,
    backgroundColor: "#FFAA5A",
    borderColor: "#FFAA5A",
  },
]

// 가상 사용자 데이터
const mockUsers = [
  { id: "1", name: "김철수" },
  { id: "2", name: "박영희" },
  { id: "3", name: "이지훈" },
  { id: "4", name: "최민지" },
  { id: "5", name: "정수민" },
]

export function ProjectCalendar() {
  const calendarRef = useRef<any>(null)
  const [showProjectPanel, setShowProjectPanel] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [events, setEvents] = useState(mockProjects)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"dayGridMonth" | "dayGridYear" | "timeGridWeek" | "timeGridDay">(
    "dayGridMonth",
  )
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isClient, setIsClient] = useState(false)

  // Add this to ensure component is mounted before rendering client components
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 새 일정 상태
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    manager: "",
    progress: 0,
    notes: "",
    backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  })

  // 오늘 날짜로 이동
  const goToToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today()
      setCurrentDate(new Date())
    }
  }

  // 날짜 클릭 핸들러
  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.date)
    setNewEvent({
      ...newEvent,
      start: clickedDate,
      end: clickedDate,
    })
    setIsAddEventOpen(true)
  }

  // 이벤트 클릭 핸들러
  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === info.event.id)
    if (event) {
      setSelectedProject(event)
      setShowProjectPanel(true)
    }
  }

  // 새 일정 추가 핸들러
  const handleAddEvent = () => {
    const color = newEvent.backgroundColor
    const newId = (events.length + 1).toString()

    const newProjectEvent = {
      id: newId,
      title: newEvent.title,
      start: format(newEvent.start, "yyyy-MM-dd"),
      end: format(newEvent.end, "yyyy-MM-dd"),
      manager: newEvent.manager,
      progress: newEvent.progress,
      notes: newEvent.notes,
      backgroundColor: color,
      borderColor: color,
    }

    setEvents([...events, newProjectEvent])
    setIsAddEventOpen(false)

    // 폼 초기화
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      manager: "",
      progress: 0,
      notes: "",
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    })
  }

  // 뷰 변경 핸들러
  const handleViewChange = (newView: string) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView)
      setViewMode(newView as any)
    }
  }

  // 이전/다음 버튼 핸들러
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev()
      setCurrentDate(calendarRef.current.getApi().getDate())
    }
  }

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next()
      setCurrentDate(calendarRef.current.getApi().getDate())
    }
  }

  // 현재 날짜 타이틀 업데이트
  const updateCurrentDate = (date: Date) => {
    setCurrentDate(date)
  }

  return (
    <div className="space-y-4">
      {/* 상단 컨트롤 영역 */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          {/* 뷰 모드 선택 */}
          <Select value={viewMode} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="보기 모드" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayGridMonth">월별</SelectItem>
              <SelectItem value="timeGridWeek">주별</SelectItem>
              <SelectItem value="timeGridDay">일별</SelectItem>
            </SelectContent>
          </Select>

          {/* 오늘 버튼 */}
          <Button variant="outline" size="sm" onClick={goToToday}>
            오늘
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* 이전/다음 이동 */}
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <CalendarIcon className="h-4 w-4 mr-1" />
            이전
          </Button>
          <h2 className="text-lg font-semibold min-w-[150px] text-center">
            {format(currentDate, "yyyy년 M월", { locale: ko })}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNext}>
            다음
            <CalendarIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* 설정 버튼 */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>캘린더 설정</DialogTitle>
                <DialogDescription>캘린더 표시 설정을 변경합니다.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="calendar-view">기본 보기 모드</Label>
                  <Select value={viewMode} onValueChange={handleViewChange}>
                    <SelectTrigger id="calendar-view">
                      <SelectValue placeholder="보기 모드" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dayGridMonth">월별</SelectItem>
                      <SelectItem value="timeGridWeek">주별</SelectItem>
                      <SelectItem value="timeGridDay">일별</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsSettingsOpen(false)}>확인</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 프로젝트 패널 토글 버튼 */}
          <Button variant="outline" size="icon" onClick={() => setShowProjectPanel(!showProjectPanel)}>
            {showProjectPanel ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex">
        {/* 캘린더 영역 */}
        <div className={cn("", showProjectPanel ? "w-3/4 pr-4" : "w-full")}>
          <div className="rounded-lg shadow p-2">
            {isClient && (
              <FullCalendarComponent
                events={events}
                viewMode={viewMode}
                onDateClick={handleDateClick}
                onEventClick={handleEventClick}
                onDateChange={updateCurrentDate}
                calendarRef={calendarRef}
              />
            )}
          </div>
        </div>

        {/* 프로젝트 정보 패널 */}
        {showProjectPanel && (
          <div className="w-1/4 transition-all duration-300 ease-in-out">
            <Card>
              <CardContent className="p-4">
                {selectedProject ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{selectedProject.title}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">시작일:</span>
                        <span className="text-sm font-medium">{selectedProject.start}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">종료일:</span>
                        <span className="text-sm font-medium">{selectedProject.end}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">담당자:</span>
                        <span className="text-sm font-medium">{selectedProject.manager}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">진행률:</span>
                          <span className="text-sm font-medium">{selectedProject.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${selectedProject.progress}%`,
                              backgroundColor: selectedProject.backgroundColor,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 text-gray-400">프로젝트를 선택하세요</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 일정 추가 모달 */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>일정 등록</DialogTitle>
            <DialogDescription>새로운 일정을 등록합니다. 모든 필드를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-name">일정명</Label>
              <Input
                id="event-name"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="일정 이름을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">시작일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newEvent.start, "yyyy-MM-dd")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.start}
                      onSelect={(date) => date && setNewEvent({ ...newEvent, start: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">종료일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newEvent.end, "yyyy-MM-dd")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.end}
                      onSelect={(date) => date && setNewEvent({ ...newEvent, end: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">담당자</Label>
              <Select value={newEvent.manager} onValueChange={(value) => setNewEvent({ ...newEvent, manager: value })}>
                <SelectTrigger id="manager">
                  <SelectValue placeholder="담당자 선택" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="progress">진행률</Label>
                <span className="text-sm">{newEvent.progress}%</span>
              </div>
              <Slider
                id="progress"
                min={0}
                max={100}
                step={5}
                value={[newEvent.progress]}
                onValueChange={(value) => setNewEvent({ ...newEvent, progress: value[0] })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                value={newEvent.notes}
                onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                placeholder="추가 정보를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddEvent}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
