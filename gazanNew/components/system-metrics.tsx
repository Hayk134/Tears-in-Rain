"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Cpu, MemoryStick, HardDrive, Network } from "lucide-react"
import { useState, useEffect } from "react"

interface SystemMetricsProps {
  data: {
    cpu: number
    memory: number
    disk: number
    network: number
    load: number
    processes: number
  }
  isRunning: boolean
}

export function SystemMetrics({ data, isRunning }: SystemMetricsProps) {
  const [history, setHistory] = useState<Array<any>>([])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString()
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: timestamp,
            cpu: data.cpu,
            memory: data.memory,
            disk: data.disk,
            network: data.network,
          },
        ]
        return newHistory.slice(-20) // Keep last 20 points
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [data, isRunning])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.cpu.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {data.cpu > 80 ? "Высокая нагрузка" : data.cpu > 50 ? "Умеренная нагрузка" : "Низкая нагрузка"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Память</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.memory.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {data.memory > 85
                ? "Критический уровень"
                : data.memory > 70
                  ? "Высокое использование"
                  : "Нормальное использование"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Диск I/O</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.disk.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {data.disk > 90 ? "Интенсивная активность" : "Нормальная активность"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сеть</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.network.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {data.network > 80 ? "Высокий трафик" : "Нормальный трафик"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU и Память</CardTitle>
            <CardDescription>История использования ресурсов</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="hsl(var(--chart-1))" strokeWidth={2} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Память %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Диск и Сеть</CardTitle>
            <CardDescription>Активность I/O операций</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="disk"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                  name="Диск %"
                />
                <Area
                  type="monotone"
                  dataKey="network"
                  stackId="1"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.6}
                  name="Сеть %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
