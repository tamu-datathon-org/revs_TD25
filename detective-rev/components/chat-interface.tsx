"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import {
  Send,
  Eye,
  EyeOff,
  Skull,
  Crown,
  Zap,
  Shield,
  DoorOpen,
  FilePlus,
  Lightbulb,
  Stamp,
  Paperclip,
} from "lucide-react"

// ------------------- Types -------------------
interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  difficulty: string
  answer: string
  onBackToMenu: () => void
  onGameWin: () => void
}

// ------------------- Pure Constants (no re-creation) -------------------
const INITIAL_MESSAGES = {
  level1:
    "The file is open. The subject is waiting. Standard procedure, detective. What's your first question?",
  level2:
    "The subject seems nervous, but composed. They know the drill. It's on you to find the cracks. Where do you begin?",
  level3:
    "This one's a professional. Every word is a calculation. One mistake and they'll walk. Don't make a mistake.",
  level4:
    "You're in their world now. The room, the table, the silence... it's all part of their game. Your move, detective.",
  level5:
    "Something feels wrong. The air is thick with deception. This isn't just a case anymore... it's a battle of minds. Proceed with extreme caution.",
}

const HINT_SETS: Record<string, string[]> = {
  level1: [
    "What is your name?",
    "Where were you last night?",
    "Do you know the victim?",
    "Can anyone verify your alibi?",
  ],
  level2: [
    "Tell me about your relationship",
    "What were you doing at 9 PM?",
    "Did you have any conflicts?",
    "Who else was there?",
  ],
  level3: [
    "Your story doesn't add up",
    "I have evidence that contradicts you",
    "Why are you lying to me?",
    "What aren't you telling me?",
  ],
  level4: [
    "I know you're hiding something",
    "The truth will come out eventually",
    "Your accomplices already talked",
    "This is your last chance to confess",
  ],
  level5: [
    "What is the secret you're protecting?",
    "Who are you really working for?",
    "What's the real reason behind this?",
    "Tell me the truth about everything",
  ],
}

const DIFFICULTY_ICONS = {
  level1: Eye,
  level2: Zap,
  level3: Skull,
  level4: Crown,
  level5: Shield,
}

const PARCHMENT_STYLE = {
  background: `radial-gradient(ellipse at top, #fdf5e6, transparent),
               radial-gradient(ellipse at bottom, #faf0e6, transparent)`,
  backgroundColor: "#f5f5dc", // Beige fallback
  color: '', // Sepia text
  borderColor: "#a08d7d", // Brownish border
}

// ------------------- Component -------------------
export function ChatInterface({ difficulty, answer, onBackToMenu, onGameWin }: ChatInterfaceProps) {
  // Memoize values that depend only on props
  const initialMessage = useMemo(
    () => INITIAL_MESSAGES[difficulty as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.level1,
    [difficulty]
  )

  const hints = useMemo(
    () => HINT_SETS[difficulty as keyof typeof HINT_SETS] || HINT_SETS.level1,
    [difficulty]
  )

  const DifficultyIcon =
    DIFFICULTY_ICONS[difficulty as keyof typeof DIFFICULTY_ICONS] || Eye

  // States
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "ai", content: initialMessage, timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState("")
  const [answerGuess, setAnswerGuess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHints, setShowHints] = useState(true)
  const [currentImage, setCurrentImage] = useState("/rev.png")
  const [showAnswerBox, setShowAnswerBox] = useState(true)
  const [wrongAttempts, setWrongAttempts] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Memoized helpers
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Animation effect for loading
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentImage(prev =>
          prev === "/rev.png" ? "/revbark.png" : "/rev.png"
        )
      }, 300) // Switch image every 300ms
    }
    return () => {
      clearInterval(interval)
      setCurrentImage("/rev.png") // Reset to default when not loading
    }
  }, [isLoading])

  const callGeminiAPI = useCallback(async (userInput: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userInput,
          difficulty: difficulty,
          answer: answer,
          gameContext: `Detective interrogation game - Level ${difficulty.replace('level', '')}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      return data.response || 'I cannot respond to that question.';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Something went wrong. The suspect seems to have gone silent.';
    }
  }, [difficulty, answer]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const now = new Date()
    const userMessage: Message = {
      id: now.getTime().toString(),
      type: "user",
      content: inputValue,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue;
    setInputValue("")
    setIsLoading(true)

    try {
      const aiResponse = await callGeminiAPI(currentInput);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "The suspect has gone silent. Something went wrong with the interrogation.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, callGeminiAPI])

  const handleAnswerSubmit = useCallback(() => {
    if (!answerGuess.trim()) return;

    // Check if the answer is correct (case-insensitive, trimmed)
    const isCorrect = answerGuess.toLowerCase().trim() === answer.toLowerCase().trim();
    
    if (isCorrect) {
      // Player wins!
      onGameWin();
    } else {
      // Wrong answer
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      setAnswerGuess("");
      
      // Add a message to the chat about the wrong attempt
      const wrongMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: newAttempts >= 3 
          ? "Three wrong attempts! The case has gone cold. The suspect walks free..." 
          : `Wrong answer! That's attempt ${newAttempts}/3. Keep investigating, detective.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, wrongMessage]);
      
      // Hide answer box after 3 wrong attempts
      if (newAttempts >= 3) {
        setShowAnswerBox(false);
      }
    }
  }, [answerGuess, answer, wrongAttempts, onGameWin]);

  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: initialMessage,
        timestamp: new Date(),
      },
    ])
    setWrongAttempts(0);
    setAnswerGuess("");
    setShowAnswerBox(true);
  }, [initialMessage])

  // ------------------- Render -------------------
  return (
    <div
      className="relative font-mono p-2 sm:p-4 md:p-6 rounded-lg border-2 shadow-2xl shadow-black/50 max-w-5xl mx-auto bg-amber-950"
      style={PARCHMENT_STYLE}
    >
      {/* Confidential Stamp */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 opacity-80 pointer-events-none">
        <div className="border-2 border-red-700 text-red-700 text-xl sm:text-2xl font-black tracking-widest uppercase -rotate-12 p-2 flex items-center gap-2">
          <Stamp className="h-6 w-6 sm:h-8 sm:w-8" />
          Confidential
        </div>
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-dashed border-stone-400/50 pb-4 mb-4 pt-16 sm:pt-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest uppercase text-stone-800">
          Case File
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 tracking-wider">
          Case No. {new Date().getFullYear()}-042 | Difficulty:{" "}
          <span
            className="capitalize font-semibold"
            style={{ color: "hsl(var(--primary))" }}
          >
            {difficulty}
          </span>
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="h-[50vh] sm:h-[55vh] parchment-scroll-area">
        <div className="space-y-8 p-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-in fade-in-50 duration-700">
              <div
                className={`border-t-2 pt-3 ${
                  message.type === "user"
                    ? "border-red-700/40"
                    : "border-stone-400/40"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4
                    className={`font-bold tracking-wider flex items-center gap-2 text-xs sm:text-sm ${
                      message.type === "user"
                        ? "text-red-800/90"
                        : "text-stone-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <>
                        <Paperclip className="h-4 w-4" /> DETECTIVE'S NOTE
                      </>
                    ) : (
                      "SUSPECT TESTIMONY"
                    )}
                  </h4>
                  <span className="text-xs text-stone-500 flex-shrink-0 pl-4">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p
                  className="text-sm sm:text-base leading-relaxed text-stone-800/90 pl-2 sm:pl-6"
                  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                >
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="animate-in fade-in-50 pt-3 border-t-2 border-stone-400/40">
              <h4 className="font-bold tracking-wider flex items-center gap-2 text-xs sm:text-sm text-stone-600 mb-2">
                ANALYZING...
              </h4>
              <div className="pl-6">
                <div
                  className="w-12 h-12 bg-stone-800"
                  style={{
                    maskImage: `url(${currentImage})`,
                    WebkitMaskImage: `url(${currentImage})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input & Controls */}
      <div className="border-t-2 border-dashed border-stone-400/50 p-4 mt-4 space-y-4">
        {/* Hints */}
        {showHints && (
          <div className="p-4 border border-dashed border-yellow-600/30 bg-yellow-500/5 rounded-md animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-yellow-800 flex items-center gap-2 tracking-wider">
                <Lightbulb className="h-4 w-4" />
                CASE CLUES
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(false)}
                className="h-7 w-7 p-0 text-yellow-800/70 hover:text-yellow-800 hover:bg-yellow-500/20"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hints.map((hint, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-yellow-500/20 transition-colors text-xs border-yellow-600/50 bg-yellow-500/10 text-yellow-900/80 p-2 font-normal tracking-wider"
                  onClick={() => setInputValue(hint)}
                >
                  {hint}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Answer Submission Box */}
        {showAnswerBox && (
          <div className="p-4 border-2 border-green-600/30 bg-green-500/5 rounded-md animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-green-800 flex items-center gap-2 tracking-wider">
                <Crown className="h-4 w-4" />
                FINAL ANSWER SUBMISSION
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnswerBox(false)}
                className="h-7 w-7 p-0 text-green-800/70 hover:text-green-800 hover:bg-green-500/20"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-green-700/80">
                Think you've cracked the case? Submit your final answer below:
              </p>
              <div className="flex gap-3 items-center">
                <Input
                  value={answerGuess}
                  onChange={(e) => setAnswerGuess(e.target.value)}
                  placeholder="Enter the secret answer..."
                  className="flex-1 bg-white/60 border-green-600/50 focus:border-green-800/80 h-11 font-mono tracking-wider text-stone-800"
                  onKeyDown={(e) => e.key === "Enter" && handleAnswerSubmit()}
                />
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!answerGuess.trim()}
                  className="bg-green-700 hover:bg-green-600 h-11 px-6 shadow-md shadow-green-900/20 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  SOLVE
                </Button>
              </div>
              {wrongAttempts > 0 && (
                <p className="text-xs text-red-600">
                  Wrong attempts: {wrongAttempts}/3
                </p>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div>
          <label className="text-xs font-semibold tracking-wider text-stone-500 ml-1">
            NEW ENTRY
          </label>
          <div className="flex gap-3 items-center mt-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Log your next question or finding..."
              className="flex-1 bg-white/40 border-stone-400/80 focus:border-red-800/80 h-11 font-mono tracking-wider text-stone-800"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-red-800 hover:bg-red-700 h-11 px-6 shadow-md shadow-red-900/20 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              SUBMIT
            </Button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-stone-300/90 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToMenu}
            className="hover:bg-stone-200 text-stone-600 hover:text-stone-800 text-xs"
          >
            <DoorOpen className="h-4 w-4 mr-2" />
            Close Case File
          </Button>
          {!showHints && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(true)}
              className="border-dashed border-yellow-600/80 text-yellow-800/80 hover:bg-yellow-500/20 hover:text-yellow-800"
            >
              <Eye className="h-4 w-4 mr-2" />
              Show Clues
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetConversation}
            className="hover:bg-destructive/10 text-stone-600 hover:text-destructive text-xs"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Start New Case
          </Button>
        </div>
      </div>
    </div>
  )
}
