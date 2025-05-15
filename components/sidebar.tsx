"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Printer,
  Briefcase,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "대시보드",
      icon: LayoutDashboard,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "프로젝트 관리",
      icon: Briefcase,
      href: "/projects",
      active: pathname.includes("/projects"),
    },
    {
      label: "장치 관리",
      icon: Printer,
      href: "/device-management",
      active: pathname.includes("/device-management"),
    },
    {
      label: "재고 관리",
      icon: Package,
      href: "/products",
      active: pathname.includes("/products"),
    },
    {
      label: "일정 관리",
      icon: Calendar,
      href: "/schedule",
      active: pathname.includes("/schedule"),
    },
    {
      label: "관리자 관리",
      icon: Users,
      href: "/admin-management",
      active: pathname.includes("/admin-management"),
    },
    {
      label: "설정 관리",
      icon: Settings,
      href: "/settings",
      active: pathname.includes("/settings"),
    },
  ]

  return (
    <div className={cn("relative h-screen border-r bg-card transition-all duration-300", isOpen ? "w-64" : "w-[70px]")}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
            <path d="M3 9h4" />
            <path d="M17 9h4" />
            <path d="M8 4v5" />
            <path d="M16 4v5" />
          </svg>
          {isOpen && <span className="ml-2 text-lg font-bold">ERP System</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden rounded-full p-1 hover:bg-accent lg:block"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      <div className="flex flex-col gap-1 py-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex h-10 items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              route.active ? "bg-accent text-accent-foreground" : "transparent",
              !isOpen && "justify-center",
            )}
          >
            <route.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
            {isOpen && <span>{route.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
