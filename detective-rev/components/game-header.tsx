import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export function GameHeader() {
  return (
    <Card className="mb-8 p-8 text-center border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="space-y-4">
        <Image
          src="/revlogo.PNG"
          alt="Detective Rev Logo"
          width={300}
          height={336}
          className="mx-auto mb-4"
        />

        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
          {
            "A murder has been committed in the shadows of the city. You're the detective, and I'm your only witness. But can you trust what I tell you?"
          }
        </p>
      </div>
    </Card>
  )
}
