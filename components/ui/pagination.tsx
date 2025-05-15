"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

const PaginationContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex w-full items-center justify-center", className)} {...props} />
  },
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors",
          "hover:bg-secondary hover:text-secondary-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationItem.displayName = "PaginationItem"

const PaginationLink = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors",
          "hover:bg-secondary hover:text-secondary-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background p-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-md border border-border bg-background p-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      />
    )
  },
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("h-8 w-8 items-center justify-center rounded-md text-sm font-medium", className)}
        {...props}
      />
    )
  },
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// 새로 추가한 Pagination 컴포넌트
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 maxPagesToShow 이하인 경우 모든 페이지 번호 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem
            key={i}
            className={currentPage === i ? "bg-primary text-primary-foreground" : ""}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationItem>,
        )
      }
    } else {
      // 전체 페이지가 maxPagesToShow 초과인 경우 일부 페이지만 표시
      // 항상 첫 페이지 표시
      pageNumbers.push(
        <PaginationItem
          key={1}
          className={currentPage === 1 ? "bg-primary text-primary-foreground" : ""}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationItem>,
      )

      // 현재 페이지 주변 페이지 표시
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      // 첫 페이지와 시작 페이지 사이에 간격이 있는 경우 생략 부호 표시
      if (startPage > 2) {
        pageNumbers.push(
          <PaginationEllipsis key="ellipsis-start">
            <MoreHorizontal className="h-4 w-4" />
          </PaginationEllipsis>,
        )
      }

      // 중간 페이지들 표시
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem
            key={i}
            className={currentPage === i ? "bg-primary text-primary-foreground" : ""}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationItem>,
        )
      }

      // 끝 페이지와 마지막 표시 페이지 사이에 간격이 있는 경우 생략 부호 표시
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationEllipsis key="ellipsis-end">
            <MoreHorizontal className="h-4 w-4" />
          </PaginationEllipsis>,
        )
      }

      // 항상 마지막 페이지 표시
      pageNumbers.push(
        <PaginationItem
          key={totalPages}
          className={currentPage === totalPages ? "bg-primary text-primary-foreground" : ""}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </PaginationItem>,
      )
    }

    return pageNumbers
  }

  return (
    <nav>
      <PaginationContent>
        <PaginationItem
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">이전 페이지</span>
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">다음 페이지</span>
        </PaginationItem>
      </PaginationContent>
    </nav>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
}
