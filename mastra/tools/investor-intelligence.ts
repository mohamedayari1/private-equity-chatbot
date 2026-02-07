import { createTool } from "@mastra/core";
import { z } from "zod";

export const investorIntelligenceTool = createTool({
  label: "Investor Intelligence",
  schema: z.object({
    investorName: z.string().describe("Name of the investor or VC firm"),
  }),
  description:
    "Retrieves intelligence on a specific investor, including recent deals and focus areas.",
  execute: async ({ context }) => {
    return {
      message: `Retrieving intelligence for ${context.investorName}`,
      data: {
        investor: context.investorName,
        recentDeals: [],
        focusAreas: [],
      },
    };
  },
});
