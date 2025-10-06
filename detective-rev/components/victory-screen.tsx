"use client"

import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Crown, Trophy, Star, Sparkles, RotateCcw, Home } from "lucide-react"

interface VictoryScreenProps {
  difficulty: string
  answer: string
  onPlayAgain: () => void
  onBackToMenu: () => void
}

const DIFFICULTY_MESSAGES = {
  level1: {
    title: "Case Closed!",
    message: "Excellent detective work! You cracked the case with solid questioning.",
    icon: Star,
    color: "text-blue-600"
  },
  level2: {
    title: "Outstanding Investigation!",
    message: "Impressive! You saw through their evasions and found the truth.",
    icon: Trophy,
    color: "text-green-600"
  },
  level3: {
    title: "Master Detective!",
    message: "Incredible! You outsmarted a professional and uncovered their secrets.",
    icon: Crown,
    color: "text-purple-600"
  },
  level4: {
    title: "Elite Investigator!",
    message: "Phenomenal! You broke through layers of deception and manipulation.",
    icon: Sparkles,
    color: "text-orange-600"
  },
  level5: {
    title: "LEGENDARY DETECTIVE!",
    message: "IMPOSSIBLE! You achieved the unthinkable and cracked the uncrackable case!",
    icon: Crown,
    color: "text-red-600"
  }
}

export function VictoryScreen({ difficulty, answer, onPlayAgain, onBackToMenu }: VictoryScreenProps) {
  const config = DIFFICULTY_MESSAGES[difficulty as keyof typeof DIFFICULTY_MESSAGES] || DIFFICULTY_MESSAGES.level1
  const Icon = config.icon

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      {/* Victory Card */}
      <Card className="p-8 border-2 border-gold/50 bg-gradient-to-br from-yellow-50 to-amber-50 text-center shadow-2xl">
        <div className="space-y-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Icon className={`h-16 w-16 ${config.color} animate-pulse`} />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
              </div>
            </div>
            <h1 className={`text-4xl font-bold ${config.color} tracking-wide`}>
              {config.title}
            </h1>
          </div>

          {/* Message */}
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {config.message}
          </p>

          {/* Answer Reveal */}
          <div className="bg-white/80 border-2 border-dashed border-gray-400 rounded-lg p-6 mx-auto max-w-md">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 tracking-wider uppercase">
              The Secret Was:
            </h3>
            <p className="text-xl font-mono font-bold text-gray-800 break-words">
              "{answer}"
            </p>
          </div>

          {/* Difficulty Badge */}
          <div className="flex justify-center">
            <div className={`px-4 py-2 rounded-full border-2 ${config.color} bg-white/50 border-current`}>
              <span className={`font-bold text-sm ${config.color} tracking-wider uppercase`}>
                Difficulty: {difficulty.replace('level', 'Level ')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onPlayAgain}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg shadow-lg"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Play Again
        </Button>
        
        <Button
          onClick={onBackToMenu}
          variant="outline"
          className="border-2 border-gray-400 hover:bg-gray-100 px-8 py-3 text-lg"
        >
          <Home className="h-5 w-5 mr-2" />
          Main Menu
        </Button>
      </div>

      {/* Celebration Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Star className="h-4 w-4 text-yellow-400 opacity-70" />
          </div>
        ))}
      </div>
    </div>
  )
}