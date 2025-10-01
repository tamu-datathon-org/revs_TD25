// components/ui/case-file.tsx

import { type LucideIcon } from "lucide-react"

interface CaseFileProps {
  name: string
  description: string
  Icon: LucideIcon
  isSelected: boolean
  isTransitioning: boolean
  onClick: () => void
}

export function CaseFile({
  name,
  description,
  Icon,
  isSelected,
  isTransitioning,
  onClick,
}: CaseFileProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative h-40 w-full cursor-pointer rounded-lg border-2 border-[#5c4033]/40 bg-[#d1c5ab] 
                 p-4 shadow-lg transition-all duration-300
                 hover:border-[#5c4033]/80 hover:scale-105
                 ${isTransitioning && isSelected ? "noir-glow scale-110" : ""}
                 ${isTransitioning && !isSelected ? "opacity-0 scale-90" : ""}`}
    >
      {/* Decorative Corner Clips */}
      <div className="absolute -top-1 left-3 h-4 w-1 border-t-2 border-l-2 border-[#5c4033]/40 group-hover:border-[#5c4033]/80" />
      <div className="absolute -top-1 left-7 h-4 w-1 border-t-2 border-r-2 border-[#5c4033]/40 group-hover:border-[#5c4033]/80" />
      <div className="absolute -top-1 right-3 h-4 w-1 border-t-2 border-l-2 border-[#5c4033]/40 group-hover:border-[#5c4033]/80" />
      <div className="absolute -top-1 right-7 h-4 w-1 border-t-2 border-r-2 border-[#5c4033]/40 group-hover:border-[#5c4033]/80" />

      {/* Inner paper background */}
      <div className="h-full w-full rounded-md bg-[#f5efe1] shadow-inner" />

      {/* Default View: Just the Title */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 
                   group-hover:opacity-0"
      >
        <h3 className="font-serif text-3xl font-bold tracking-wider text-stone-800">
          {name}
        </h3>
      </div>

      {/* Hover View: Icon and Details */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center space-y-2 p-4
                   text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <Icon className="h-8 w-8 text-stone-700" />
        <h4 className="font-serif text-xl font-bold text-stone-900">{name}</h4>
        <p className="text-sm font-sans text-stone-600 leading-snug">
          {description}
        </p>
      </div>
    </div>
  )
}