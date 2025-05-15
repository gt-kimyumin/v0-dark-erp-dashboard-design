"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

interface OverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Overview({ className, ...props }: OverviewProps) {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>System performance metrics for the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px] w-full">
          {/* This would be a chart in a real application */}
          <div className="flex h-full flex-col justify-between">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Orders</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">1,234</div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  12.5%
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Revenue</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">$52,489</div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  8.2%
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Customers</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">3,456</div>
                <div className="flex items-center text-sm text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  5.3%
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Returns</span>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold">43</div>
                <div className="flex items-center text-sm text-red-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  2.1%
                </div>
              </div>
            </div>
            <div className="mt-8 h-[200px] w-full">
              <div className="flex h-full items-end gap-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 70) + 30
                  return (
                    <div
                      key={i}
                      className="relative flex w-full flex-1 items-end overflow-hidden rounded-md bg-primary/10"
                    >
                      <div
                        className="absolute bottom-0 w-full bg-primary transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <div>Jan</div>
                <div>Feb</div>
                <div>Mar</div>
                <div>Apr</div>
                <div>May</div>
                <div>Jun</div>
                <div>Jul</div>
                <div>Aug</div>
                <div>Sep</div>
                <div>Oct</div>
                <div>Nov</div>
                <div>Dec</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
