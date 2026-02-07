import { createTool } from "@mastra/core";
import { z } from "zod";

export const fundingAnalysisTool = createTool({
  label: "Funding Analysis",
  schema: z.object({
    sector: z.string().optional(),
    companyName: z.string().optional(),
  }),
  description: "Analyzes funding trends for a sector or specific company.",
  execute: async ({ context }) => {
    return {
      message: "Funding analysis executed",
      data: { context },
    };
  },
});
