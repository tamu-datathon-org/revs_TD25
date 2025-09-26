"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skull, Eye, Zap, Crown } from "lucide-react"

const difficulties = [
  {
    id: "novice",
    name: "Novice Detective",
    description: "The suspect is cooperative and provides clear clues to help solve the case",
    icon: Eye,
    color: "bg-green-500/20 border-green-500/50 text-green-400",
    bgGradient: "from-green-500/10 to-green-600/5",
  },
  {
    id: "experienced",
    name: "Experienced Investigator",
    description: "The suspect is evasive and requires clever questioning to extract information",
    icon: Zap,
    color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    bgGradient: "from-yellow-500/10 to-yellow-600/5",
  },
  {
    id: "master",
    name: "Master Detective",
    description: "The suspect actively misleads and conceals crucial information from you",
    icon: Skull,
    color: "bg-red-500/20 border-red-500/50 text-red-400",
    bgGradient: "from-red-500/10 to-red-600/5",
  },
  {
    id: "legendary",
    name: "Legendary Sleuth",
    description: "The suspect is a master manipulator with hidden agendas and dark secrets",
    icon: Crown,
    color: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    bgGradient: "from-purple-500/10 to-purple-600/5",
  },
]

interface DifficultySelectorProps {
  onDifficultySelect?: (difficulty: string) => void
}

export function DifficultySelector({ onDifficultySelect }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [hoveredDifficulty, setHoveredDifficulty] = useState<string>("")

  const handleSelect = (difficultyId: string) => {
    setSelectedDifficulty(difficultyId)
  }

  const handleStartInvestigation = () => {
    if (selectedDifficulty && onDifficultySelect) {
      onDifficultySelect(selectedDifficulty)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-foreground">Choose Your Challenge</h1>
            <Skull className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select the difficulty level for your murder investigation. Each level presents a different type of suspect
            with varying degrees of cooperation.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {difficulties.map((difficulty) => {
          const IconComponent = difficulty.icon
          const isSelected = selectedDifficulty === difficulty.id
          const isHovered = hoveredDifficulty === difficulty.id

          return (
            <Card
              key={difficulty.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                isSelected
                  ? "border-primary/70 bg-primary/10 noir-glow"
                  : "border-border/50 bg-card/30 hover:border-accent/50"
              }`}
              onClick={() => handleSelect(difficulty.id)}
              onMouseEnter={() => setHoveredDifficulty(difficulty.id)}
              onMouseLeave={() => setHoveredDifficulty("")}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${difficulty.bgGradient} opacity-50`} />
              <div className="relative p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${difficulty.color} transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{difficulty.name}</h3>
                    {isSelected && (
                      <Badge variant="secondary" className="text-xs animate-in slide-in-from-left-2">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{difficulty.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {selectedDifficulty && (
        <div className="text-center animate-in slide-in-from-bottom-4 duration-500">
          <Button
            onClick={handleStartInvestigation}
            size="lg"
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-3 text-lg font-semibold noir-glow"
          >
            <Eye className="h-5 w-5 mr-2" />
            Begin Investigation
          </Button>
        </div>
      )}
    </div>
  )
}
