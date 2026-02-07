import { Agent } from "@mastra/core";
import { systemPrompt } from "./prompts";
import { tools } from "./tools";

export const peAgent = new Agent({
  name: "PE Agent",
  instructions: systemPrompt,
  model: {
    provider: "GOOGLE",
    name: "gemini-2.0-flash-exp",
    toolChoice: "auto",
  },
  tools: tools,
});
