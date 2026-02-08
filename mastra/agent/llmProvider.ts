import { createAzure } from "@ai-sdk/azure";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { config } from "dotenv";

// Load environment variables
config({ path: "../.env.local" });

/**
 * Creates and returns a configured Gemini model instance
 * @param modelId - The Gemini model to use (e.g., "gemini-1.5-flash")
 */
export const getGeminiModel = (modelId: string = "gemini-1.5-flash") => {
  console.log(`🚀 Initializing Gemini model: ${modelId}`);

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  return google(modelId);
};

export const getAzureModel = (modelId: string = "gemini-1.5-flash") => {
  console.log(`🚀 Initializing Gemini model: ${modelId}`);

  const azure = createAzure({
    apiKey: process.env.OPENAI_API_KEY,
    resourceName: "law-llm",
  });

  return azure(modelId);
};
