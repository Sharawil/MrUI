import { GoogleGenerativeAI } from "@google/generative-ai"
import { z } from "zod"

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
// This model is available to the API key configured for this project.
export const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.2,
  },
})

// Schema for expected JSON response
export const GeneratedProjectSchema = z.object({
  files: z.record(
    z.string(),
    z.object({
      code: z.string()
    })
  )
})

export type GeneratedProject = z.infer<typeof GeneratedProjectSchema>
