import { createTool } from "@mastra/core";
import { z } from "zod";

export const competitiveIntelligenceTool = createTool({
  label: "Competitive Intelligence",
  schema: z.object({
    targetCompany: z.string().describe("Company to analyze competitors for"),
  }),
  description: "Provides competitive landscape analysis for a target company.",
  execute: async ({ context }) => {
    return {
      message: `Analyzing competition for ${context.targetCompany}`,
      data: { competitors: [] },
    };
  },
});
