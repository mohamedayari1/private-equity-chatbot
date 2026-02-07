import { Agent } from "@mastra/core/agent";
import { getGeminiModel } from "./llmProvider";
import conversationMemory from "./memory";
import { calculatorTool } from "./tool";

/**
 * Creates a Gemini-powered agent with calculator tool and memory
 */
export const createCalculatorAgent = () => {
  // 1. Get the Gemini model
  const model = getGeminiModel("gemini-2.5-pro");

  // 2. Define system instructions (the agent's personality/role)
  const instructions = `
    You are a helpful mathematical assistant powered by Gemini.
    
    Your capabilities:
    - You can perform basic calculations using the calculator tool
    - You maintain conversation context and remember previous interactions
    - You explain your calculations clearly
    
    When a user asks for a calculation:
    1. Use the calculator tool to perform the operation
    2. Explain the result in a friendly, clear manner
    
    Always be helpful, accurate, and conversational.
  `.trim();

  // 3. Create and return the agent
  return new Agent({
    name: "calculator-agent",
    instructions,
    model,
    tools: {
      calculatorTool,
    },
    memory: conversationMemory,
  });
};
