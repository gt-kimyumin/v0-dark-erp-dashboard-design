"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function ProjectSearch() {
  const [searchType, setSearchType] = useState("title")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    console.log(`Searching for ${searchTerm} in ${searchType}`)
    // 실제 검색 로직은 여기에 구현
  }

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
      <div className="flex w-full max-w-md items-center gap-2">
        <Select defaultValue="title" onValueChange={setSearchType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="검색 조건" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">발주처</SelectItem>
            <SelectItem value="title">제목</SelectItem>
            <SelectItem value="worker">작업자</SelectItem>
            <SelectItem value="registrationDate">등록일</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
            aria-label="검색"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
