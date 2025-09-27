"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Shield, Volume2, Play, Pause, RotateCcw } from "lucide-react"

interface ComponentStatusProps {
  components: {
    battyAgent: { status: string; uptime: string }
    tannhauserGate: { status: string; uptime: string }
    echoesOfOrion: { status: string; uptime: string }
  }
}

export function ComponentStatus({ components }: ComponentStatusProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Активен</Badge>
      case "standby":
        return <Badge variant="secondary">Ожидание</Badge>
      case "error":
        return <Badge variant="destructive">Ошибка</Badge>
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Batty Agent
            </CardTitle>
            <CardDescription>ИИ-агент для прогнозирования проблем</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус:</span>
              {getStatusBadge(components.battyAgent.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Время работы:</span>
              <span className="text-sm font-mono">{components.battyAgent.uptime}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Pause className="w-3 h-3 mr-1" />
                Пауза
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-3 h-3 mr-1" />
                Перезапуск
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Tannhauser Gate
            </CardTitle>
            <CardDescription>Система упреждающего регулирования</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус:</span>
              {getStatusBadge(components.tannhauserGate.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Время работы:</span>
              <span className="text-sm font-mono">{components.tannhauserGate.uptime}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Play className="w-3 h-3 mr-1" />
                Активировать
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-3 h-3 mr-1" />
                Перезапуск
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-primary" />
              Echoes of Orion
            </CardTitle>
            <CardDescription>Аудио-уведомления и звуковой ландшафт</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Статус:</span>
              {getStatusBadge(components.echoesOfOrion.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Время работы:</span>
              <span className="text-sm font-mono">{components.echoesOfOrion.uptime}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Pause className="w-3 h-3 mr-1" />
                Пауза
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-3 h-3 mr-1" />
                Перезапуск
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Журнал событий</CardTitle>
          <CardDescription>Последние события системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-muted-foreground">12:34:56</span>
              <span>[BATTY]</span>
              <span>Модель переобучена на 150 образцах</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <span className="text-muted-foreground">12:34:45</span>
              <span>[ORION]</span>
              <span>Аудио-ландшафт обновлен</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-muted-foreground">12:34:32</span>
              <span>[GATE]</span>
              <span>Обнаружен риск, применено регулирование</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-muted-foreground">12:34:21</span>
              <span>[SYSTEM]</span>
              <span>Протокол успешно запущен</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
