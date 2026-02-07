import { createTool } from "@mastra/core";
import { z } from "zod";

export const portfolioConstructionTool = createTool({
  label: "Portfolio Construction",
  schema: z.object({
    strategy: z
      .string()
      .describe('Investment strategy (e.g., "Growth", "Value")'),
    capital: z.number().optional().describe("Amount of capital to allocate"),
  }),
  description:
    "Assists in constructing a balanced investment portfolio based on strategy.",
  execute: async ({ context }) => {
    return {
      message: `Analyzing portfolio strategy: ${context.strategy}`,
      data: { allocation: {} },
    };
  },
});
