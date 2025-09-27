"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, Brain, Shield, Volume2, Cpu, AlertTriangle, CheckCircle, XCircle, Play, Pause } from "lucide-react"
import { SystemMetrics } from "@/components/system-metrics"
import { ComponentStatus } from "@/components/component-status"
import { ConfigPanel } from "@/components/config-panel"

export default function TearsInRainDashboard() {
  const [isRunning, setIsRunning] = useState(false)
  const [systemData, setSystemData] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    load: 1.2,
    processes: 156,
  })

  const [prediction, setPrediction] = useState({
    riskLevel: 0.3,
    description: "Система работает нормально",
    affectedResources: [],
    confidence: 0.85,
  })

  const [components, setComponents] = useState({
    battyAgent: { status: "active", uptime: "2h 34m" },
    tannhauserGate: { status: "standby", uptime: "2h 34m" },
    echoesOfOrion: { status: "active", uptime: "2h 34m" },
  })

  // Simulate real-time data updates
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSystemData((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(0, Math.min(100, prev.disk + (Math.random() - 0.5) * 3)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        load: Math.max(0, prev.load + (Math.random() - 0.5) * 0.2),
        processes: Math.max(50, prev.processes + Math.floor((Math.random() - 0.5) * 10)),
      }))

      setPrediction((prev) => ({
        ...prev,
        riskLevel: Math.max(0, Math.min(1, prev.riskLevel + (Math.random() - 0.5) * 0.1)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isRunning])

  const toggleProtocol = () => {
    setIsRunning(!isRunning)
  }

  const getRiskColor = (risk: number) => {
    if (risk > 0.7) return "text-red-400"
    if (risk > 0.4) return "text-yellow-400"
    return "text-green-400"
  }

  const getRiskBadgeVariant = (risk: number) => {
    if (risk > 0.7) return "destructive"
    if (risk > 0.4) return "secondary"
    return "default"
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-balance">gazan</h1>
                  <p className="text-sm text-muted-foreground">Интеллектуальный мониторинг производительности</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant={isRunning ? "default" : "secondary"} className="pulse-glow">
                {isRunning ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    АКТИВЕН
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    ОСТАНОВЛЕН
                  </>
                )}
              </Badge>

              <Button onClick={toggleProtocol} variant={isRunning ? "destructive" : "default"} className="gap-2">
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Остановить
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Запустить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Панель управления</TabsTrigger>
            <TabsTrigger value="metrics">Метрики</TabsTrigger>
            <TabsTrigger value="components">Компоненты</TabsTrigger>
            <TabsTrigger value="config">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Risk Alert */}
            {prediction.riskLevel > 0.6 && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Предупреждение о риске</AlertTitle>
                <AlertDescription>
                  Обнаружен высокий риск падения производительности: {prediction.description}
                </AlertDescription>
              </Alert>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    Обзор системы
                  </CardTitle>
                  <CardDescription>Текущее состояние системных ресурсов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>CPU</span>
                          <span className={getRiskColor(systemData.cpu / 100)}>{systemData.cpu.toFixed(1)}%</span>
                        </div>
                        <Progress value={systemData.cpu} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Память</span>
                          <span className={getRiskColor(systemData.memory / 100)}>{systemData.memory.toFixed(1)}%</span>
                        </div>
                        <Progress value={systemData.memory} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Диск</span>
                          <span className={getRiskColor(systemData.disk / 100)}>{systemData.disk.toFixed(1)}%</span>
                        </div>
                        <Progress value={systemData.disk} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Сеть</span>
                          <span className={getRiskColor(systemData.network / 100)}>
                            {systemData.network.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={systemData.network} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-mono text-primary">{systemData.load.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Загрузка системы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-mono text-primary">{systemData.processes}</div>
                      <div className="text-sm text-muted-foreground">Процессов</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Прогноз ИИ
                  </CardTitle>
                  <CardDescription>Агент Батти</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-mono mb-2">
                        <span className={getRiskColor(prediction.riskLevel)}>
                          {(prediction.riskLevel * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Badge variant={getRiskBadgeVariant(prediction.riskLevel)}>Уровень риска</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Статус:</div>
                      <div className="text-sm text-muted-foreground">{prediction.description}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Уверенность:</div>
                      <Progress value={prediction.confidence * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Components Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="w-4 h-4 text-primary" />
                    Batty Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={components.battyAgent.status === "active" ? "default" : "secondary"}>
                      {components.battyAgent.status === "active" ? "Активен" : "Ожидание"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{components.battyAgent.uptime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="w-4 h-4 text-primary" />
                    Tannhauser Gate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={components.tannhauserGate.status === "active" ? "default" : "secondary"}>
                      {components.tannhauserGate.status === "active" ? "Активен" : "Ожидание"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{components.tannhauserGate.uptime}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Volume2 className="w-4 h-4 text-primary" />
                    Echoes of Orion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={components.echoesOfOrion.status === "active" ? "default" : "secondary"}>
                      {components.echoesOfOrion.status === "active" ? "Активен" : "Ожидание"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{components.echoesOfOrion.uptime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <SystemMetrics data={systemData} isRunning={isRunning} />
          </TabsContent>

          <TabsContent value="components">
            <ComponentStatus components={components} />
          </TabsContent>

          <TabsContent value="config">
            <ConfigPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
