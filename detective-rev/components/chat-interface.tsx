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
  onBackToMenu: () => void
}

// ------------------- Pure Constants (no re-creation) -------------------
const INITIAL_MESSAGES = {
  novice:
    "The file is open. The subject is waiting. Standard procedure, detective. What's your first question?",
  experienced:
    "The subject seems nervous, but composed. They know the drill. It's on you to find the cracks. Where do you begin?",
  master:
    "This one's a professional. Every word is a calculation. One mistake and they'll walk. Don't make a mistake.",
  legendary:
    "You're in their world now. The room, the table, the silence... it's all part of their game. Your move, detective.",
}

const HINT_SETS: Record<string, string[]> = {
  novice: [
    "Establish a timeline",
    "Confirm the alibi",
    "Ask about the victim",
    "Check for inconsistencies",
  ],
  experienced: [
    "Press on memory gaps",
    "Inquire about motives",
    "Bring up physical evidence",
    "Note suspicious behavior",
  ],
  master: [
    "Use leading questions",
    "Present a false theory",
    "Confront with a direct accusation",
    "Leverage their ego",
  ],
  legendary: [
    "Question their reality",
    "Uncover the hidden agenda",
    "Turn their logic against them",
    "Break the fourth wall",
  ],
}

const RESPONSE_SETS: Record<string, string[]> = {
  novice: [
    "The victim was Dr. Eleanor Blackwood, a renowned archaeologist. She was working late in the library that night, researching ancient artifacts.",
    "The murder weapon was a letter opener from the desk. It was found beside the body with fingerprints still on it.",
    "I saw her around 11:30 PM. She seemed nervous about something, kept looking over her shoulder.",
    "There were three other people in the house that night: the butler, the gardener, and Dr. Blackwood's research assistant.",
  ],
  experienced: [
    "Dr. Blackwood? Yes, I knew her... professionally. But I can't say we were close. Why does that matter?",
    "A letter opener, you say? Interesting. I wouldn't know anything about that. I was in my room all evening.",
    "Look, Detective, I've told you what I remember. My memory isn't perfect, especially after a few drinks that night.",
    "Other people? Well, there might have been others around. The house is large, people come and go...",
  ],
  master: [
    "Dr. Blackwood was a fool who meddled in things she didn't understand. But that doesn't mean I killed her.",
    "You're barking up the wrong tree, Detective. The real killer is probably long gone by now.",
    "Evidence? What evidence? You have nothing concrete, just speculation and circumstantial nonsense.",
    "I find it amusing that you think you can solve this case. Better detectives than you have tried and failed.",
  ],
  legendary: [
    "Ah, you're getting warmer, Detective. But you're still missing the bigger picture. This goes deeper than one simple murder.",
    "You think this is about Dr. Blackwood? She was just a pawn in a much larger game. The question is: are you smart enough to see it?",
    "Every answer I give you is a choice, Detective. Choose wisely, because some truths are more dangerous than lies.",
    "You're playing my game now, whether you realize it or not. The question is: will you survive long enough to win?",
  ],
}

const DIFFICULTY_ICONS = {
  novice: Eye,
  experienced: Zap,
  master: Skull,
  legendary: Crown,
}

const PARCHMENT_STYLE = {
  background: `radial-gradient(ellipse at top, #fdf5e6, transparent),
               radial-gradient(ellipse at bottom, #faf0e6, transparent)`,
  backgroundColor: "#f5f5dc", // Beige fallback
  color: '', // Sepia text
  borderColor: "#a08d7d", // Brownish border
}

// ------------------- Component -------------------
export function ChatInterface({ difficulty, onBackToMenu }: ChatInterfaceProps) {
  // Memoize values that depend only on props
  const initialMessage = useMemo(
    () => INITIAL_MESSAGES[difficulty as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.novice,
    [difficulty]
  )

  const hints = useMemo(
    () => HINT_SETS[difficulty as keyof typeof HINT_SETS] || HINT_SETS.novice,
    [difficulty]
  )

  const DifficultyIcon =
    DIFFICULTY_ICONS[difficulty as keyof typeof DIFFICULTY_ICONS] || Eye

  // States
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "ai", content: initialMessage, timestamp: new Date() },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHints, setShowHints] = useState(true)
  const [currentImage, setCurrentImage] = useState("/rev.png")

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

  const generateMockResponse = useCallback(
    (userInput: string): string => {
      const responses =
        RESPONSE_SETS[difficulty as keyof typeof RESPONSE_SETS] ||
        RESPONSE_SETS.novice
      return responses[Math.floor(Math.random() * responses.length)]
    },
    [difficulty]
  )

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isLoading) return

    const now = new Date()
    const userMessage: Message = {
      id: now.getTime().toString(),
      type: "user",
      content: inputValue,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulated AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1200) // slightly shorter delay for smoother UX
  }, [inputValue, isLoading, generateMockResponse])

  const resetConversation = useCallback(() => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: initialMessage,
        timestamp: new Date(),
      },
    ])
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
