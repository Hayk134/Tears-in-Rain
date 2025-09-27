"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, RotateCcw } from "lucide-react"
import { useState } from "react"

export function ConfigPanel() {
  const [config, setConfig] = useState({
    monitoring: {
      interval: 5,
      metricsInterval: 2,
      riskThreshold: 0.6,
    },
    audio: {
      enabled: true,
      baseFrequency: 220,
      maxVolume: 0.7,
    },
    throttling: {
      enabled: true,
      cpuThreshold: 80,
      memoryThreshold: 85,
      maxNiceValue: 19,
    },
  })

  const handleSave = () => {
    // Here you would save the configuration
    console.log("Saving configuration:", config)
  }

  const handleReset = () => {
    // Reset to defaults
    setConfig({
      monitoring: {
        interval: 5,
        metricsInterval: 2,
        riskThreshold: 0.6,
      },
      audio: {
        enabled: true,
        baseFrequency: 220,
        maxVolume: 0.7,
      },
      throttling: {
        enabled: true,
        cpuThreshold: 80,
        memoryThreshold: 85,
        maxNiceValue: 19,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Конфигурация системы
          </CardTitle>
          <CardDescription>Настройка параметров Tears in Rain Protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitoring" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
              <TabsTrigger value="audio">Аудио</TabsTrigger>
              <TabsTrigger value="throttling">Регулирование</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interval">Интервал мониторинга (сек)</Label>
                  <Input
                    id="interval"
                    type="number"
                    value={config.monitoring.interval}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, interval: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metricsInterval">Интервал сбора метрик (сек)</Label>
                  <Input
                    id="metricsInterval"
                    type="number"
                    value={config.monitoring.metricsInterval}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, metricsInterval: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Порог риска: {config.monitoring.riskThreshold}</Label>
                <Slider
                  value={[config.monitoring.riskThreshold]}
                  onValueChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      monitoring: { ...prev.monitoring, riskThreshold: value[0] },
                    }))
                  }
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="audioEnabled"
                  checked={config.audio.enabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      audio: { ...prev.audio, enabled: checked },
                    }))
                  }
                />
                <Label htmlFor="audioEnabled">Включить аудио-уведомления</Label>
              </div>

              {config.audio.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseFreq">Базовая частота (Гц)</Label>
                    <Input
                      id="baseFreq"
                      type="number"
                      value={config.audio.baseFrequency}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          audio: { ...prev.audio, baseFrequency: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Максимальная громкость: {config.audio.maxVolume}</Label>
                    <Slider
                      value={[config.audio.maxVolume]}
                      onValueChange={(value) =>
                        setConfig((prev) => ({
                          ...prev,
                          audio: { ...prev.audio, maxVolume: value[0] },
                        }))
                      }
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="throttling" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="throttlingEnabled"
                  checked={config.throttling.enabled}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      throttling: { ...prev.throttling, enabled: checked },
                    }))
                  }
                />
                <Label htmlFor="throttlingEnabled">Включить автоматическое регулирование</Label>
              </div>

              {config.throttling.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpuThreshold">Порог CPU (%)</Label>
                    <Input
                      id="cpuThreshold"
                      type="number"
                      value={config.throttling.cpuThreshold}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          throttling: { ...prev.throttling, cpuThreshold: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memoryThreshold">Порог памяти (%)</Label>
                    <Input
                      id="memoryThreshold"
                      type="number"
                      value={config.throttling.memoryThreshold}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          throttling: { ...prev.throttling, memoryThreshold: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxNice">Макс. Nice значение</Label>
                    <Input
                      id="maxNice"
                      type="number"
                      value={config.throttling.maxNiceValue}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          throttling: { ...prev.throttling, maxNiceValue: Number.parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Сохранить
            </Button>
            <Button onClick={handleReset} variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="w-4 h-4" />
              Сбросить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
