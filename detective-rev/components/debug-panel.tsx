"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Eye, EyeOff } from "lucide-react"

interface DebugPanelProps {
  answer: string
  difficulty: string
}

export function DebugPanel({ answer, difficulty }: DebugPanelProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-red-900/90 text-white border-red-700 max-w-sm">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">DEBUG PANEL</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAnswer(!showAnswer)}
            className="h-6 w-6 p-0 text-white hover:bg-red-800"
          >
            {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        <div className="text-xs space-y-1">
          <div>
            <strong>Difficulty:</strong> {difficulty}
          </div>
          <div>
            <strong>Answer:</strong> {showAnswer ? answer : "••••••••••••"}
          </div>
        </div>
        <div className="text-xs text-red-200">
          (Development only - hidden in production)
        </div>
      </div>
    </Card>
  )
}