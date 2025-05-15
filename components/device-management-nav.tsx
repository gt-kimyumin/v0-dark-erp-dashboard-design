"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceAddForm } from "@/components/device-add-form"
import { DeviceStatusTable } from "@/components/device-status-table"
import { DeviceUsageGraph } from "@/components/device-usage-graph"
import { PlusCircle, ListFilter, BarChart3 } from "lucide-react"

export function DeviceManagementNav() {
  const [activeTab, setActiveTab] = useState("status")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>장치 관리</CardTitle>
          <CardDescription>3D 프린터 및 기타 장치의 추가, 현황 조회, 사용량 분석을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="status" className="flex items-center">
                <ListFilter className="mr-2 h-4 w-4" />
                장치 현황 조회
              </TabsTrigger>
              <TabsTrigger value="add" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                장치 추가
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex items-center">
                <BarChart3 className="mr-2 h-4 w-4" />
                그래프
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="mt-6">
              <DeviceStatusTable />
            </TabsContent>

            <TabsContent value="add" className="mt-6">
              <DeviceAddForm onSuccess={() => setActiveTab("status")} />
            </TabsContent>

            <TabsContent value="graph" className="mt-6">
              <DeviceUsageGraph />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
