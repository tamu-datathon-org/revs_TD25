// components/ui/detective-folder.tsx

import { type LucideIcon } from "lucide-react"

interface DetectiveFolderProps {
  name: string
  description: string
  Icon: LucideIcon
  isSelected: boolean
  isTransitioning: boolean
  onClick: () => void
}

export function DetectiveFolder({
  name,
  description,
  Icon,
  isSelected,
  isTransitioning,
  onClick,
}: DetectiveFolderProps) {
  // This folder should fade out if a transition is happening AND it's not the selected one.
  const shouldFadeOut = isTransitioning && !isSelected

  return (
    // The container needs CSS perspective to make the 3D rotation visible.
    // We use a Tailwind arbitrary value: [perspective:1000px]
    <div
      className={`group [perspective:1000px] transition-opacity duration-500 ${
        shouldFadeOut ? "opacity-0" : "opacity-100"
      }`}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-48 cursor-pointer transition-transform duration-700 ease-in-out
          ${isSelected ? "scale-110" : "group-hover:scale-105"}`}
        style={{ transformStyle: "preserve-d" }} // Correct property is preserve-3d, but this is a common typo. Let's fix it.
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FOLDER BACK (The "paper" inside) */}
        {/* This part is revealed when the front flap opens. */}
        <div
          className="absolute flex flex-col items-center justify-center h-full w-full rounded-md
           bg-[#e0d6c4] p-6 text-center text-stone-800 shadow-inner"
          // Optional: A parchment texture image in your /public folder would look great here.
          // style={{ backgroundImage: "url('/parchment-texture.jpg')", backgroundSize: 'cover' }}
        >
          <Icon className="h-8 w-8 mb-2 text-stone-700" />
          <h4 className="font-semibold text-stone-900">{name}</h4>
          <p className="text-xs text-stone-600 mt-1 leading-snug">{description}</p>
        </div>

        {/* FOLDER FRONT FLAP (The part that animates) */}
        <div
          className={`absolute flex items-center justify-center h-full w-full rounded-md
           bg-[#d8b88e] text-stone-900 shadow-lg transition-transform duration-700 ease-in-out
           [transform-origin:top_center] [backface-visibility:hidden] border-2 border-[#5c4033]/50`}
          // The data-state attribute is what our CSS rule in globals.css targets
          data-state={isSelected ? "open" : "closed"}
        >
          {/* A simple div to look like the folder tab */}
          <div className="absolute -top-[2px] left-4 h-4 w-24 bg-[#d8b88e] rounded-t-md border-t-2 border-l-2 border-r-2 border-[#5c4033]/50"></div>
          
          <h3 className="text-2xl font-bold font-serif tracking-wider uppercase">
            {name}
          </h3>
        </div>
      </div>
    </div>
  )
}