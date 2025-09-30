// components/difficulty-selector.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card" // Keep for the header
import { DetectiveFolder } from "@/components/ui/detective-folder" // Import our new component
import { Skull, Eye, Zap, Crown } from "lucide-react"

const difficulties = [
  {
    id: "novice",
    name: "Novice", // Shorter names fit better on the folder flap
    description: "The suspect is cooperative and provides clear clues.",
    icon: Eye,
  },
  {
    id: "experienced",
    name: "Experienced",
    description: "The suspect is evasive and requires clever questioning.",
    icon: Zap,
  },
  {
    id: "master",
    name: "Master",
    description: "The suspect actively misleads and conceals information.",
    icon: Skull,
  },
  {
    id: "legendary",
    name: "Legendary",
    description: "A master manipulator with hidden agendas and dark secrets.",
    icon: Crown,
  },
]

interface DifficultySelectorProps {
  onDifficultySelect?: (difficulty: string) => void
}

export function DifficultySelector({ onDifficultySelect }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  // New state to manage the overall animation sequence
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSelect = (difficultyId: string) => {
    // Prevent clicking another folder while one is already animating
    if (isTransitioning) return

    setSelectedDifficulty(difficultyId)
    setIsTransitioning(true)

    // Wait for the animation to finish (folder open + others fade) before transitioning the screen.
    // This timeout is crucial for the user experience.
    setTimeout(() => {
      if (onDifficultySelect) {
        onDifficultySelect(difficultyId)
      }
    }, 1500) // Duration: 700ms open + 500ms fade + 300ms buffer
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-700">
      {/* The header Card still works well thematically */}
      <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl font-bold text-foreground">Choose Your Case File</h1>
            <Skull className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select a case file to begin your investigation. Each presents a unique challenge.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 pt-8">
        {difficulties.map((difficulty) => (
          <DetectiveFolder
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

      {/* The "Begin Investigation" button is no longer needed! */}
    </div>
  )
}