"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// 가상 알림 데이터
const notifications = [
  {
    id: "1",
    title: "프로젝트 마감일 임박",
    description: "웹사이트 리뉴얼 프로젝트의 마감일이 3일 남았습니다.",
    time: "10분 전",
    read: false,
  },
  {
    id: "2",
    title: "3D 프린터 소재 부족",
    description: "프린터 A의 소재가 20% 남았습니다. 소재를 보충해주세요.",
    time: "30분 전",
    read: false,
  },
  {
    id: "3",
    title: "새 프로젝트 등록",
    description: "모바일 앱 개발 프로젝트가 새로 등록되었습니다.",
    time: "1시간 전",
    read: true,
  },
  {
    id: "4",
    title: "승인 요청",
    description: "김철수님이 제출한 문서가 승인 대기 중입니다.",
    time: "2시간 전",
    read: true,
  },
  {
    id: "5",
    title: "프린터 작업 완료",
    description: "프린터 B의 작업이 완료되었습니다.",
    time: "3시간 전",
    read: true,
  },
]

export function Notifications() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(notifications)

  const unreadCount = notifs.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">알림</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              모두 읽음 표시
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifs.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
              알림이 없습니다.
            </div>
          ) : (
            <div className="grid gap-1">
              {notifs.map((notification) => (
                <button
                  key={notification.id}
                  className={cn(
                    "flex flex-col gap-1 rounded-md p-3 text-left text-sm transition-colors hover:bg-muted",
                    !notification.read && "bg-muted/50",
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.description}</span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
