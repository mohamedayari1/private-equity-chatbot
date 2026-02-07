import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { config } from "dotenv";

// Load environment variables
config();

/**
 * Creates and returns a configured Gemini model instance
 * @param modelId - The Gemini model to use (e.g., "gemini-1.5-flash")
 */
export const getGeminiModel = (modelId: string = "gemini-1.5-flash") => {
  console.log(`🚀 Initializing Gemini model: ${modelId}`);
  
  const google = createGoogleGenerativeAI({
    // apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    apiKey: "AIzaSyCkDNXP0UYZj4STREgHUPsnqA2y4nXqYOA",
  });

  return google(modelId);
};