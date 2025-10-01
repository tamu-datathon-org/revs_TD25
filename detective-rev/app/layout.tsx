// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google" // 1. ADD THIS IMPORT
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

// 2. ADD THIS FONT CONFIGURATION
const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Detective Rev - Murder Mystery AI",
  description: "Unravel the mystery. Question the AI. Discover the truth.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      {/* 3. ADD THE NEW FONT VARIABLE TO THE BODY CLASSNAME */}
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${fontSerif.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}