import { createTool } from "@mastra/core";
import { z } from "zod";

export const geographicAnalysisTool = createTool({
  label: "Geographic Analysis",
  schema: z.object({
    region: z.string().describe("Region to analyze"),
    sector: z.string().optional().describe("Sector context for the region"),
  }),
  description:
    "Analyzes geographic strengths and investment activity in a specific region.",
  execute: async ({ context }) => {
    return {
      message: `Analyzing region: ${context.region}`,
      data: { region: context.region, activity: "High" },
    };
  },
});
