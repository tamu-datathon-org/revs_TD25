"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "@/components/chat-interface"
import { GameHeader } from "@/components/game-header"
import { DifficultySelector } from "@/components/difficulty-selector"
import { VictoryScreen } from "@/components/victory-screen"
import { DebugPanel } from "@/components/debug-panel"

export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<string>("")
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)

  // Fetch the current answer from server based on difficulty
  const fetchCurrentAnswer = async (difficulty: string) => {
    setIsLoadingAnswer(true);
    try {
      const response = await fetch(`/api/answer?difficulty=${difficulty}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentAnswer(data.answer);
      } else {
        console.error('Failed to fetch answer');
        // Fallback answer in case of server error
        setCurrentAnswer("The butler did it with the candlestick in the library");
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
      // Fallback answer in case of network error
      setCurrentAnswer("The butler did it with the candlestick in the library");
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  // Fetch answer when game starts
  useEffect(() => {
    if (gameStarted && !currentAnswer && selectedDifficulty) {
      fetchCurrentAnswer(selectedDifficulty);
    }
  }, [gameStarted, selectedDifficulty]);

  const handleDifficultySelect = async (difficulty: string) => {
    setSelectedDifficulty(difficulty)
    setGameStarted(true)
    setGameWon(false)
    // Fetch fresh answer for new game
    await fetchCurrentAnswer(difficulty);
  }

  const handleBackToMenu = () => {
    setGameStarted(false)
    setSelectedDifficulty(null)
    setGameWon(false)
  }

  const handleGameWin = () => {
    setGameWon(true)
  }

  const handlePlayAgain = async () => {
    setGameWon(false)
    setGameStarted(false)
    setSelectedDifficulty(null)
    setCurrentAnswer("")
    // Answer will be fetched when new difficulty is selected
  }

  return (
    <div className="min-h-screen film-grain">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <GameHeader />

        {!gameStarted ? (
          <DifficultySelector onDifficultySelect={handleDifficultySelect} />
        ) : gameWon ? (
          <VictoryScreen
            difficulty={selectedDifficulty!}
            answer={currentAnswer}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
          />
        ) : isLoadingAnswer ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg text-muted-foreground">Loading case file...</p>
            </div>
          </div>
        ) : (
          <>
            <ChatInterface
              difficulty={selectedDifficulty!}
              answer={currentAnswer}
              onBackToMenu={handleBackToMenu}
              onGameWin={handleGameWin}
            />
            <DebugPanel answer={currentAnswer} difficulty={selectedDifficulty!} />
          </>
        )}
      </div>
    </div>
  )
}
