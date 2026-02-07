import { createTool } from "@mastra/core";
import { z } from "zod";

export const trendAnalysisTool = createTool({
  label: "Trend Analysis",
  schema: z.object({
    topic: z.string().describe("Topic or sector to analyze trends for"),
  }),
  description: "Analyzes emerging trends in a specific area.",
  execute: async ({ context }) => {
    return {
      message: `Analyzing trends for ${context.topic}`,
      data: { trends: [] },
    };
  },
});
