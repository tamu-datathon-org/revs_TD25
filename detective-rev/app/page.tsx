"use client"

import { useState } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { GameHeader } from "@/components/game-header"
import { DifficultySelector } from "@/components/difficulty-selector"

export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setGameStarted(true)
  }

  const handleBackToMenu = () => {
    setGameStarted(false)
    setSelectedDifficulty(null)
  }

  return (
    <div className="min-h-screen bg-background film-grain">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <GameHeader />

        {!gameStarted ? (
          <DifficultySelector onDifficultySelect={handleDifficultySelect} />
        ) : (
          <ChatInterface difficulty={selectedDifficulty!} onBackToMenu={handleBackToMenu} />
        )}
      </div>
    </div>
  )
}
