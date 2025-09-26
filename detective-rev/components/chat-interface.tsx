"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, RotateCcw, Eye, EyeOff, ArrowLeft, Skull, Crown, Zap } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  difficulty: string
  onBackToMenu: () => void
}

export function ChatInterface({ difficulty, onBackToMenu }: ChatInterfaceProps) {
  const getInitialMessage = (diff: string): string => {
    const messages = {
      novice:
        "Good evening, Detective. I've been expecting you. The body was discovered at midnight in the library. I'm willing to cooperate fully with your investigation. What would you like to know?",
      experienced:
        "Detective... I suppose you're here about the unfortunate incident. Yes, I was here that night, but I'm not sure how much help I can be. The details are... fuzzy. What exactly do you want to know?",
      master:
        "Ah, another detective. How predictable. Yes, there was a death - tragic, really. But I'm afraid my memory isn't what it used to be. Perhaps you should look elsewhere for answers?",
      legendary:
        "Detective, welcome to my domain. You think you can solve this little puzzle? How... amusing. The victim got what they deserved, but proving it? That's another matter entirely. Shall we dance?",
    }
    return messages[diff as keyof typeof messages] || messages.novice
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: getInitialMessage(difficulty),
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHints, setShowHints] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const getHints = (diff: string): string[] => {
    const hintSets = {
      novice: [
        "Ask about the victim's identity",
        "Inquire about the time of death",
        "Question what they were doing that night",
        "Ask about other people present",
        "Investigate the murder weapon",
      ],
      experienced: [
        "Press for specific details about their alibi",
        "Ask about their relationship with the victim",
        "Question inconsistencies in their story",
        "Inquire about potential motives",
        "Challenge their memory gaps",
      ],
      master: [
        "Confront them with evidence",
        "Ask about their whereabouts during the murder",
        "Question their suspicious behavior",
        "Press them on their lies",
        "Demand the truth about their involvement",
      ],
      legendary: [
        "Challenge their manipulative tactics",
        "Ask about their hidden agenda",
        "Question their true motives",
        "Confront them about their deception",
        "Demand they stop playing games",
      ],
    }
    return hintSets[diff as keyof typeof hintSets] || hintSets.novice
  }

  const hints = getHints(difficulty)

  const getDifficultyIcon = (diff: string) => {
    const icons = {
      novice: Eye,
      experienced: Zap,
      master: Skull,
      legendary: Crown,
    }
    return icons[diff as keyof typeof icons] || Eye
  }

  const DifficultyIcon = getDifficultyIcon(difficulty)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateMockResponse(inputValue, difficulty),
        timestamp: new Date(),
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateMockResponse = (userInput: string, diff: string): string => {
    const responseSets = {
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

    const responses = responseSets[diff as keyof typeof responseSets] || responseSets.novice
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const resetConversation = () => {
    setMessages([
      {
        id: "1",
        type: "ai",
        content: getInitialMessage(difficulty),
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-500">
      <Card className="p-4 border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBackToMenu}
            className="border-border/50 hover:bg-secondary/30 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <div className="flex items-center gap-2">
            <DifficultyIcon className="h-5 w-5 text-primary" />
            <Badge variant="secondary" className="capitalize">
              {difficulty} Mode
            </Badge>
          </div>

          <Button
            variant="outline"
            onClick={resetConversation}
            className="border-border/50 hover:bg-secondary/30 bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Chat Messages */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-secondary-foreground border border-border/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm">{message.type === "user" ? "🕵️" : "🎭"}</span>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${message.isTyping ? "typewriter" : ""}`}>
                        {message.content}
                      </p>
                      <span className="text-xs opacity-70 mt-1 block">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 text-secondary-foreground border border-border/50 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎭</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Hints Panel */}
      {showHints && (
        <Card className="p-4 border-accent/20 bg-accent/5 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-accent">Investigation Hints</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowHints(false)} className="h-6 w-6 p-0">
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hints.map((hint, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-accent/20 transition-colors text-xs border-accent/30"
                onClick={() => setInputValue(hint)}
              >
                {hint}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Input Area */}
      <Card className="p-4 border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your question, Detective..."
            className="flex-1 bg-input/50 border-border/50 focus:border-primary/50"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/80"
          >
            <Send className="h-4 w-4" />
          </Button>
          {!showHints && (
            <Button
              variant="outline"
              onClick={() => setShowHints(true)}
              className="border-border/50 hover:bg-secondary/30"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
