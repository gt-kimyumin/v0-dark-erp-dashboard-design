"use client"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralInventory } from "@/components/inventory/general-inventory"
import { PrintMaterials } from "@/components/inventory/print-materials"
import { useRouter, useSearchParams } from "next/navigation"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "general"

  const handleTabChange = (value: string) => {
    router.push(`/products?tab=${value}`)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="재고 관리" text="일반 재고 및 3D 프린트 소재 관리" />
      <div className="w-full">
        <Tabs defaultValue={tab} value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="general">일반 재고</TabsTrigger>
            <TabsTrigger value="print-materials">3D 프린트 소재</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 w-full">
            <GeneralInventory />
          </TabsContent>
          <TabsContent value="print-materials" className="mt-4 w-full">
            <PrintMaterials />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
