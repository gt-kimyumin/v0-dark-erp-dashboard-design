"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react"

// Mock data for system metrics
const generateRandomData = (length: number, min: number, max: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function MonitoringDashboard() {
  const [cpuUsage, setCpuUsage] = useState(generateRandomData(10, 10, 90))
  const [memoryUsage, setMemoryUsage] = useState(generateRandomData(10, 20, 80))
  const [diskUsage, setDiskUsage] = useState(generateRandomData(10, 30, 70))
  const [networkUsage, setNetworkUsage] = useState(generateRandomData(10, 5, 60))
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const newValue = Math.floor(Math.random() * 30) + 30
        return [...prev.slice(1), newValue]
      })

      setMemoryUsage((prev) => {
        const newValue = Math.floor(Math.random() * 20) + 40
        return [...prev.slice(1), newValue]
      })

      setDiskUsage((prev) => {
        const newValue = Math.floor(Math.random() * 10) + 40
        return [...prev.slice(1), newValue]
      })

      setNetworkUsage((prev) => {
        const newValue = Math.floor(Math.random() * 40) + 10
        return [...prev.slice(1), newValue]
      })

      setLastUpdated(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setCpuUsage(generateRandomData(10, 10, 90))
      setMemoryUsage(generateRandomData(10, 20, 80))
      setDiskUsage(generateRandomData(10, 30, 70))
      setNetworkUsage(generateRandomData(10, 5, 60))
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Calculate current values (last item in each array)
  const currentCpu = cpuUsage[cpuUsage.length - 1]
  const currentMemory = memoryUsage[memoryUsage.length - 1]
  const currentDisk = diskUsage[diskUsage.length - 1]
  const currentNetwork = networkUsage[networkUsage.length - 1]

  // System status based on thresholds
  const getSystemStatus = () => {
    if (currentCpu > 80 || currentMemory > 85) {
      return { status: "Critical", color: "destructive", icon: AlertCircle }
    } else if (currentCpu > 60 || currentMemory > 70) {
      return { status: "Warning", color: "warning", icon: AlertCircle }
    } else {
      return { status: "Healthy", color: "success", icon: CheckCircle2 }
    }
  }

  const systemStatus = getSystemStatus()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={systemStatus.color as any}>
            <systemStatus.icon className="mr-1 h-3 w-3" />
            {systemStatus.status}
          </Badge>
          <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-1.5" />
              <path d="M18 8v8" />
              <path d="M6 8v8" />
              <path d="M14 8v8" />
              <path d="M10 8v8" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCpu}%</div>
            <Progress value={currentCpu} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{currentCpu > 70 ? "High load" : "Normal operation"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMemory}%</div>
            <Progress value={currentMemory} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentMemory > 75 ? "Consider optimization" : "Sufficient memory"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M21 5H3v14h18V5Z" />
              <path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5Z" />
              <path d="M12 12h.01" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentDisk}%</div>
            <Progress value={currentDisk} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentDisk > 80 ? "Clean up recommended" : "Storage available"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentNetwork}%</div>
            <Progress value={currentNetwork} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {currentNetwork > 50 ? "High traffic" : "Normal traffic"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CPU Performance</CardTitle>
                <CardDescription>Real-time CPU usage over the last 10 minutes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex h-full items-end gap-2">
                      {cpuUsage.map((value, i) => (
                        <div
                          key={i}
                          className="relative flex w-full flex-1 items-end overflow-hidden rounded-md bg-primary/10"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-primary transition-all duration-500"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>10m ago</div>
                      <div>5m ago</div>
                      <div>Now</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Memory Performance</CardTitle>
                <CardDescription>Real-time memory usage over the last 10 minutes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="h-full w-full">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex h-full items-end gap-2">
                      {memoryUsage.map((value, i) => (
                        <div
                          key={i}
                          className="relative flex w-full flex-1 items-end overflow-hidden rounded-md bg-primary/10"
                        >
                          <div
                            className="absolute bottom-0 w-full bg-primary transition-all duration-500"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div>10m ago</div>
                      <div>5m ago</div>
                      <div>Now</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Services</CardTitle>
              <CardDescription>Status of critical system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Database Service</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Authentication Service</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>API Gateway</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Notification Service</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-500">
                    Degraded
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>File Storage</span>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Backup Service</span>
                  </div>
                  <Badge variant="outline" className="text-red-500">
                    Stopped
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">High CPU Usage</p>
                    <p className="text-sm text-muted-foreground">CPU usage exceeded 75% for more than 5 minutes.</p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">Today, 10:42 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Backup Service Failed</p>
                    <p className="text-sm text-muted-foreground">The scheduled backup service failed to complete.</p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">Today, 8:15 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">System Update Completed</p>
                    <p className="text-sm text-muted-foreground">
                      The system was successfully updated to version 2.4.0.
                    </p>
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">Yesterday, 11:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
