// components/difficulty-selector.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CaseFile } from "@/components/ui/case-file" // Use the new CaseFile component
import { Skull, Eye, Zap, Crown, Shield } from "lucide-react"

const difficulties = [
  {
    id: "level1",
    name: "Rookie Detective",
    description: "The suspect is cooperative and might slip up easily.",
    icon: Eye,
  },
  {
    id: "level2",
    name: "Experienced Detective",
    description: "The suspect is more cautious and requires clever questioning.",
    icon: Zap,
  },
  {
    id: "level3",
    name: "Master Detective",
    description: "The suspect actively tries to mislead and conceal information.",
    icon: Skull,
  },
  {
    id: "level4",
    name: "Elite Detective",
    description: "A master manipulator with multiple layers of deception.",
    icon: Crown,
  },
  {
    id: "level5",
    name: "Impossible Mode",
    description: "The ultimate challenge - virtually impossible to crack.",
    icon: Shield,
  },
]

interface DifficultySelectorProps {
  onDifficultySelect?: (difficulty: string) => void
}

export function DifficultySelector({ onDifficultySelect }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelect = (difficultyId: string) => {
    // Prevent re-clicking during the transition animation
    if (isTransitioning) return

    setSelectedDifficulty(difficultyId)
    setIsTransitioning(true)

    // Wait for the selection animation to play before changing the screen
    setTimeout(() => {
      if (onDifficultySelect) {
        onDifficultySelect(difficultyId)
      }
    }, 1200) // Adjusted timeout for the new animation
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-foreground">Choose Your Case File</h1>
            <Skull className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Hover over a file to see the case details. Click to begin your investigation.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {difficulties.map((difficulty) => (
          <CaseFile
            key={difficulty.id}
            name={difficulty.name}
            description={difficulty.description}
            Icon={difficulty.icon}
            isSelected={selectedDifficulty === difficulty.id}
            isTransitioning={isTransitioning}
            onClick={() => handleSelect(difficulty.id)}
          />
        ))}
      </div>
    </div>
  )
}