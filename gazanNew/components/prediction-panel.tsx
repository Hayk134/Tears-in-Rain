"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface PredictionPanelProps {
  prediction: {
    riskLevel: number
    description: string
    affectedResources: string[]
    confidence: number
    recommendations?: string[]
  }
}

export function PredictionPanel({ prediction }: PredictionPanelProps) {
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

  const getRiskIcon = (risk: number) => {
    if (risk > 0.7) return <AlertTriangle className="w-4 h-4" />
    if (risk > 0.4) return <Clock className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Прогноз агента Батти
          </CardTitle>
          <CardDescription>Анализ рисков производительности на основе машинного обучения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-mono">
              <span className={getRiskColor(prediction.riskLevel)}>{(prediction.riskLevel * 100).toFixed(0)}%</span>
            </div>
            <Badge variant={getRiskBadgeVariant(prediction.riskLevel)} className="gap-2">
              {getRiskIcon(prediction.riskLevel)}
              Уровень риска
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Уверенность модели</span>
                <span>{(prediction.confidence * 100).toFixed(1)}%</span>
              </div>
              <Progress value={prediction.confidence * 100} className="h-2" />
            </div>

            <Alert>
              <AlertDescription>{prediction.description}</AlertDescription>
            </Alert>

            {prediction.affectedResources.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Затронутые ресурсы:</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.affectedResources.map((resource, index) => (
                    <Badge key={index} variant="outline">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {prediction.recommendations && prediction.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Рекомендации:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
