"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function GameHeader() {
  return (
    <Card className="mb-8 p-8 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
            Detective Rev
          </h1>
        </div>

        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          {
            "A murder has been committed in the shadows of the city. You're the detective, and I'm your only witness. But can you trust what I tell you?"
          }
        </p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-secondary/50">
            🎭 Murder Mystery
          </Badge>
          <Badge variant="outline" className="border-accent/50 text-accent">
            🤖 AI Powered
          </Badge>
          <Badge variant="outline" className="border-primary/50 text-primary">
            🕵️ Detective Game
          </Badge>
        </div>
      </div>
    </Card>
  )
}
