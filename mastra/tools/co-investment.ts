import { createTool } from "@mastra/core";
import { z } from "zod";

export const coInvestmentTool = createTool({
  label: "Co-Investment Opportunities",
  schema: z.object({
    dealId: z.string().optional(),
    investor: z.string().optional(),
  }),
  description: "Identifies potential co-investment partners or opportunities.",
  execute: async ({ context }) => {
    return {
      message: "Searching for co-investment opportunities",
      data: { opportunities: [] },
    };
  },
});
