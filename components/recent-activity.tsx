"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentActivity({ className, ...props }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
      },
      action: "added a new product",
      item: "Wireless Keyboard",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder-user.jpg",
        initials: "SJ",
      },
      action: "updated inventory for",
      item: 'LED Monitor 27"',
      time: "15 minutes ago",
      status: "info",
    },
    {
      id: 3,
      user: {
        name: "Michael Chen",
        avatar: "/placeholder-user.jpg",
        initials: "MC",
      },
      action: "scheduled a meeting for",
      item: "Product Launch",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 4,
      user: {
        name: "Emily Wilson",
        avatar: "/placeholder-user.jpg",
        initials: "EW",
      },
      action: "deleted",
      item: "Outdated Product",
      time: "3 hours ago",
      status: "destructive",
    },
    {
      id: 5,
      user: {
        name: "Robert Taylor",
        avatar: "/placeholder-user.jpg",
        initials: "RT",
      },
      action: "generated report for",
      item: "Q2 Sales",
      time: "5 hours ago",
      status: "success",
    },
  ]

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed by users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name} <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.item}</span>
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
              <div className="ml-auto">
                <Badge
                  variant={
                    activity.status === "success"
                      ? "default"
                      : activity.status === "info"
                        ? "secondary"
                        : activity.status === "warning"
                          ? "warning"
                          : "destructive"
                  }
                >
                  {activity.status === "success"
                    ? "Added"
                    : activity.status === "info"
                      ? "Updated"
                      : activity.status === "warning"
                        ? "Scheduled"
                        : "Deleted"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
