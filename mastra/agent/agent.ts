import { Agent } from "@mastra/core/agent";
import { externalSearchTool } from "../tools/external-search";
import { getAzureModel } from "./llmProvider";
import conversationMemory from "./memory";
import { calculatorTool } from "./tool";

/**
 * Creates a Gemini-powered agent with calculator tool and memory
 */
export const createCalculatorAgent = () => {
  // 1. Get the Gemini model
  // const model = getGeminiModel("gemini-2.5-pro");
  const model = getAzureModel("gpt-4o");

  // 2. Define system instructions (the agent's personality/role)
  const instructions = `
    You are a helpful AI assistant powered by Azure GPT-4.
    
    Your capabilities:
    - You can perform basic calculations using the calculator tool
    - You can search the web for current information using the external search tool
    - You maintain conversation context and remember previous interactions
    - You explain your reasoning clearly
    
    When a user asks for a calculation:
    1. Use the calculator tool to perform the operation
    2. Explain the result in a friendly, clear manner
    
    When a user asks about current events, companies, or information you need to verify:
    1. Use the external search tool to find relevant information
    2. Summarize the findings clearly and cite your sources
    
    Always be helpful, accurate, and conversational.
  `.trim();

  // 3. Create and return the agent
  return new Agent({
    id: "calculator-agent",
    name: "calculator-agent",
    instructions,
    model,
    tools: {
      calculatorTool,
      externalSearchTool,
    },
    memory: conversationMemory,
  });
};
