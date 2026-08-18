import { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { Toaster } from "sonner"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "MrUI — Generate Websites from Screenshots",
  description: "Upload a screenshot and get a responsive React webpage instantly",
  openGraph: {
    title: "MrUI",
    description: "AI-powered screenshot to website generator",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  )
}
